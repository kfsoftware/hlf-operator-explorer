package resolvers

import (
	"bytes"
	"context"
	"crypto/x509"
	"encoding/base64"
	"fmt"
	"github.com/golang/protobuf/proto"
	"github.com/hyperledger/fabric-config/configtx"
	"github.com/hyperledger/fabric-config/configtx/membership"
	"github.com/hyperledger/fabric-config/configtx/orderer"
	"github.com/hyperledger/fabric-config/protolator"
	cb "github.com/hyperledger/fabric-protos-go/common"
	msp2 "github.com/hyperledger/fabric-sdk-go/pkg/client/msp"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/resmgmt"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/msp"
	"github.com/hyperledger/fabric-sdk-go/pkg/fab/resource"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	"github.com/hyperledger/fabric/protoutil"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/models"
	"github.com/kfsoftware/hlf-operator/controllers/utils"
	"github.com/pkg/errors"

	"time"
)

func (r *mutationResolver) GetUpdateChannelBlock(ctx context.Context, input models.GetUpdateChannelBlockInput) (*models.GetUpdateChannelBlockResponse, error) {
	clientProvider := r.FabricSDK.Context(fabsdk.WithUser(r.User), fabsdk.WithOrg(r.MSPID))
	resmgmtClient, err := resmgmt.New(clientProvider)
	if err != nil {
		return nil, err
	}
	block, err := resmgmtClient.QueryConfigBlockFromOrderer(input.ChannelID)
	if err != nil {
		return nil, err
	}
	cfgBlock, err := resource.ExtractConfigFromBlock(block)
	if err != nil {
		return nil, err
	}
	cftxGen := configtx.New(cfgBlock)
	if input.Orderer != nil {
		cfgOrd := cftxGen.Orderer()
		if input.Orderer.BatchTimeout != nil {
			i := time.Duration(*input.Orderer.BatchTimeout)
			timeout := i * time.Millisecond
			err = cfgOrd.SetBatchTimeout(timeout)
			if err != nil {
				return nil, err
			}
		}
		if input.Orderer.State != nil {
			err = cfgOrd.SetConsensusState(orderer.ConsensusState(*input.Orderer.State))
			if err != nil {
				return nil, err
			}
		}
		for _, policyInput := range input.Orderer.AddPolicies {
			err = cfgOrd.SetPolicy(policyInput.Key, configtx.Policy{
				Type:      policyInput.Type,
				Rule:      policyInput.Rule,
				ModPolicy: configtx.AdminsPolicyKey,
			})
			if err != nil {
				return nil, err
			}
		}
		for _, capability := range input.Orderer.AddCapabilities {
			err = cfgOrd.AddCapability(capability)
			if err != nil {
				return nil, err
			}
		}
		for _, o := range input.Orderer.AddOrganizations {
			configtxMSP, err := mapMSPToConfigtxMSP(o.Msp)
			if err != nil {
				return nil, err
			}
			cfgOrg := configtx.Organization{
				Name:             o.MspID,
				Policies:         mapPoliciesInputToPolicies(o.Policies),
				MSP:              configtxMSP,
				AnchorPeers:      mapAddressInputToAddress(o.AnchorPeers),
				OrdererEndpoints: o.OrdererEndpoints,
				ModPolicy:        o.ModPolicy,
			}
			err = cfgOrd.SetOrganization(cfgOrg)
			if err != nil {
				return nil, err
			}
		}
		for _, mspID := range input.Orderer.DelOrganizations {
			cfgOrd.RemoveOrganization(mspID)
		}
		if input.Orderer.BatchSize != nil {
			err = cfgOrd.BatchSize().SetAbsoluteMaxBytes(uint32(input.Orderer.BatchSize.AbsoluteMaxBytes))
			if err != nil {
				return nil, err
			}
			err = cfgOrd.BatchSize().SetPreferredMaxBytes(uint32(input.Orderer.BatchSize.PreferredMaxBytes))
			if err != nil {
				return nil, err
			}
			err = cfgOrd.BatchSize().SetMaxMessageCount(uint32(input.Orderer.BatchSize.MaxMessageCount))
			if err != nil {
				return nil, err
			}
		}
		if input.Orderer.EtcdRaft != nil {
			for _, consenter := range input.Orderer.EtcdRaft.DelConsenters {
				clientTlsPem, err := base64.StdEncoding.DecodeString(consenter.ClientTLSCert)
				if err != nil {
					return nil, err
				}
				serverTlsPem, err := base64.StdEncoding.DecodeString(consenter.ServerTLSCert)
				if err != nil {
					return nil, err
				}
				clientTls, err := utils.ParseX509Certificate(clientTlsPem)
				if err != nil {
					return nil, err
				}
				serverTls, err := utils.ParseX509Certificate(serverTlsPem)
				if err != nil {
					return nil, err
				}
				err = cfgOrd.RemoveConsenter(orderer.Consenter{
					Address: orderer.EtcdAddress{
						Host: consenter.Address.Host,
						Port: consenter.Address.Port,
					},
					ClientTLSCert: clientTls,
					ServerTLSCert: serverTls,
				})
				if err != nil {
					return nil, err
				}
			}
			for _, consenter := range input.Orderer.EtcdRaft.AddConsenters {
				clientTlsPem, err := base64.StdEncoding.DecodeString(consenter.ClientTLSCert)
				if err != nil {
					return nil, err
				}
				serverTlsPem, err := base64.StdEncoding.DecodeString(consenter.ServerTLSCert)
				if err != nil {
					return nil, err
				}
				clientTls, err := utils.ParseX509Certificate(clientTlsPem)
				if err != nil {
					return nil, err
				}
				serverTls, err := utils.ParseX509Certificate(serverTlsPem)
				if err != nil {
					return nil, err
				}
				err = cfgOrd.AddConsenter(orderer.Consenter{
					Address: orderer.EtcdAddress{
						Host: consenter.Address.Host,
						Port: consenter.Address.Port,
					},
					ClientTLSCert: clientTls,
					ServerTLSCert: serverTls,
				})
				if err != nil {
					return nil, err
				}
			}
			if input.Orderer.EtcdRaft.Options != nil {
				err = cfgOrd.EtcdRaftOptions().SetSnapshotIntervalSize(uint32(input.Orderer.EtcdRaft.Options.SnapshotIntervalSize))
				if err != nil {
					return nil, err
				}
				err = cfgOrd.EtcdRaftOptions().SetElectionInterval(uint32(input.Orderer.EtcdRaft.Options.ElectionTick))
				if err != nil {
					return nil, err
				}
				err = cfgOrd.EtcdRaftOptions().SetHeartbeatTick(uint32(input.Orderer.EtcdRaft.Options.HeartbeatTick))
				if err != nil {
					return nil, err
				}
				err = cfgOrd.EtcdRaftOptions().SetMaxInflightBlocks(uint32(input.Orderer.EtcdRaft.Options.MaxInflightBlocks))
				if err != nil {
					return nil, err
				}
				err = cfgOrd.EtcdRaftOptions().SetTickInterval(input.Orderer.EtcdRaft.Options.TickInterval)
				if err != nil {
					return nil, err
				}

			}
		}
	}
	application := cftxGen.Application()
	for _, capability := range input.Application.Capabilities {
		err = application.AddCapability(capability)
		if err != nil {
			return nil, err
		}
	}
	for _, o := range input.Application.AddOrgs {
		configtxMSP, err := mapMSPToConfigtxMSP(o.Msp)
		if err != nil {
			return nil, err
		}
		cfgOrg := configtx.Organization{
			Name:             o.MspID,
			Policies:         mapPoliciesInputToPolicies(o.Policies),
			MSP:              configtxMSP,
			AnchorPeers:      mapAddressInputToAddress(o.AnchorPeers),
			OrdererEndpoints: o.OrdererEndpoints,
			ModPolicy:        o.ModPolicy,
		}
		err = application.SetOrganization(cfgOrg)
		if err != nil {
			return nil, err
		}
	}
	for _, mspID := range input.Application.DelOrgs {
		application.RemoveOrganization(mspID)
	}
	for _, policyInput := range input.Application.Policies {
		err = application.SetPolicy(policyInput.Key, configtx.Policy{
			Type:      policyInput.Type,
			Rule:      policyInput.Rule,
			ModPolicy: configtx.AdminsPolicyKey,
		})
		if err != nil {
			return nil, err
		}
	}
	chConfig := cftxGen.Channel()
	for _, policyInput := range input.Channel.Policies {
		err = chConfig.SetPolicy(policyInput.Key, configtx.Policy{
			Type:      policyInput.Type,
			Rule:      policyInput.Rule,
			ModPolicy: policyInput.ModPolicy,
		})
		if err != nil {
			return nil, err
		}
	}
	for _, capability := range input.Channel.Capabilities {
		err = chConfig.AddCapability(capability)
		if err != nil {
			return nil, err
		}
	}
	c, err := proto.Marshal(cftxGen.UpdatedConfig())
	if err != nil {
		return nil, err
	}
	configUpdateBytes, err := cftxGen.ComputeMarshaledUpdate(input.ChannelID)
	if err != nil {
		return nil, err
	}
	configUpdate := &cb.ConfigUpdate{}
	err = proto.Unmarshal(configUpdateBytes, configUpdate)
	if err != nil {
		return nil, err
	}
	var buffer bytes.Buffer
	err = protolator.DeepMarshalJSON(&buffer, configUpdate)
	if err != nil {
		return nil, err
	}
	return &models.GetUpdateChannelBlockResponse{
		Block:        base64.StdEncoding.EncodeToString(c),
		ConfigUpdate: buffer.String(),
		Errors:       []*models.Error{},
	}, nil
}

func mapPoliciesInputToPolicies(policies []*models.PolicyInput) map[string]configtx.Policy {
	cfgtxPolicies := map[string]configtx.Policy{}
	for _, policy := range policies {
		cfgtxPolicies[policy.Key] = configtx.Policy{
			Type:      policy.Type,
			Rule:      policy.Rule,
			ModPolicy: policy.ModPolicy,
		}
	}
	return cfgtxPolicies
}
func mapCertificateList(certs []string) ([]*x509.Certificate, error) {
	var x509Certs []*x509.Certificate
	for _, cert := range certs {
		b64Bytes, err := base64.StdEncoding.DecodeString(cert)
		if err != nil {
			return nil, err
		}
		x509Cert, err := utils.ParseX509Certificate(b64Bytes)
		if err != nil {
			return nil, err
		}
		x509Certs = append(x509Certs, x509Cert)
	}
	return x509Certs, nil
}

func mapMSPToConfigtxMSP(input *models.MSPInput) (configtx.MSP, error) {
	rootCerts, err := mapCertificateList(input.RootCerts)
	if err != nil {
		return configtx.MSP{}, err
	}
	tlsRootCerts, err := mapCertificateList(input.TLSRootCerts)
	if err != nil {
		return configtx.MSP{}, err
	}
	intermediateCerts, err := mapCertificateList(input.IntermediateCerts)
	if err != nil {
		return configtx.MSP{}, err
	}
	tlsIntermediateCerts, err := mapCertificateList(input.TLSIntermediateCerts)
	if err != nil {
		return configtx.MSP{}, err
	}
	adminCerts, err := mapCertificateList(input.Admins)
	if err != nil {
		return configtx.MSP{}, err
	}
	nodeOUs, err := mapNodeOUs(input.NodeOUs)
	if err != nil {
		return configtx.MSP{}, err
	}
	cftxMSP := configtx.MSP{
		Name:                          input.Name,
		RootCerts:                     rootCerts,
		IntermediateCerts:             intermediateCerts,
		Admins:                        adminCerts,
		RevocationList:                nil,
		OrganizationalUnitIdentifiers: nil,
		CryptoConfig: membership.CryptoConfig{
			SignatureHashFamily:            input.CryptoConfig.SignatureHashFamily,
			IdentityIdentifierHashFunction: input.CryptoConfig.IdentityIdentifierHashFunction,
		},
		TLSRootCerts:         tlsRootCerts,
		TLSIntermediateCerts: tlsIntermediateCerts,
		NodeOUs:              nodeOUs,
	}

	return cftxMSP, nil
}

func mapNodeOUs(us *models.NodeOUsInput) (membership.NodeOUs, error) {
	clientCertificatePem, err := base64.StdEncoding.DecodeString(us.ClientOUIdentifier.Certificate)
	if err != nil {
		return membership.NodeOUs{}, err
	}
	peerCertificatePem, err := base64.StdEncoding.DecodeString(us.PeerOUIdentifier.Certificate)
	if err != nil {
		return membership.NodeOUs{}, err
	}
	adminCertificatePem, err := base64.StdEncoding.DecodeString(us.AdminOUIdentifier.Certificate)
	if err != nil {
		return membership.NodeOUs{}, err
	}
	ordererCertificatePem, err := base64.StdEncoding.DecodeString(us.OrdererOUIdentifier.Certificate)
	if err != nil {
		return membership.NodeOUs{}, err
	}
	clientCert, err := utils.ParseX509Certificate(clientCertificatePem)
	if err != nil {
		return membership.NodeOUs{}, nil
	}
	peerCert, err := utils.ParseX509Certificate(peerCertificatePem)
	if err != nil {
		return membership.NodeOUs{}, nil
	}
	adminCert, err := utils.ParseX509Certificate(adminCertificatePem)
	if err != nil {
		return membership.NodeOUs{}, nil
	}
	ordererCert, err := utils.ParseX509Certificate(ordererCertificatePem)
	if err != nil {
		return membership.NodeOUs{}, nil
	}
	nodeOUs := membership.NodeOUs{
		Enable: true,
		ClientOUIdentifier: membership.OUIdentifier{
			Certificate:                  clientCert,
			OrganizationalUnitIdentifier: us.ClientOUIdentifier.OuIdentifier,
		},
		PeerOUIdentifier: membership.OUIdentifier{
			Certificate:                  peerCert,
			OrganizationalUnitIdentifier: us.PeerOUIdentifier.OuIdentifier,
		},
		AdminOUIdentifier: membership.OUIdentifier{
			Certificate:                  adminCert,
			OrganizationalUnitIdentifier: us.AdminOUIdentifier.OuIdentifier,
		},
		OrdererOUIdentifier: membership.OUIdentifier{
			Certificate:                  ordererCert,
			OrganizationalUnitIdentifier: us.OrdererOUIdentifier.OuIdentifier,
		},
	}
	return nodeOUs, nil
}

func mapAddressInputToAddress(addresses []*models.NetworkAddressInput) []configtx.Address {
	var cfgtxAddresses []configtx.Address
	for _, addr := range addresses {
		cfgtxAddresses = append(cfgtxAddresses, configtx.Address{
			Host: addr.Host,
			Port: addr.Port,
		})
	}
	return cfgtxAddresses
}

func (r *mutationResolver) UpdateChannel(ctx context.Context, input models.UpdateChannelInput) (*models.UpdateChannelResponse, error) {
	var identities []msp.SigningIdentity
	configBackend, err := r.FabricSDK.Config()
	if err != nil {
		return nil, err
	}

	for _, mspSignature := range input.MspSignatures {
		_ = mspSignature
		org, ok := r.Organizations[mspSignature.MspID]
		if !ok {
			return nil, fmt.Errorf("organization %s not found", mspSignature.MspID)
		}
		userCertKey := fmt.Sprintf("organizations.%s.users.%s.cert.pem", org.MSPID, org.User)
		userPrivateKey := fmt.Sprintf("organizations.%s.users.%s.key.pem", org.MSPID, org.User)
		userCertString, certExists := configBackend.Lookup(userCertKey)
		if !certExists {
			return nil, fmt.Errorf("user certificate for %s not found", org.MSPID)
		}
		userKeyString, keyExists := configBackend.Lookup(userPrivateKey)
		if !keyExists {
			return nil, fmt.Errorf("user private key for %s not found", org.MSPID)
		}
		mspClient, err := msp2.New(r.FabricSDK.Context(), msp2.WithOrg(org.MSPID))
		if err != nil {
			return nil, errors.Wrapf(err, "failed to create msp client")
		}
		signingIdentity, err := mspClient.CreateSigningIdentity(
			msp.WithPrivateKey([]byte(userKeyString.(string))),
			msp.WithCert([]byte(userCertString.(string))),
		)
		if err != nil {
			return nil, errors.Wrapf(err, "failed to create signing identity")
		}
		identities = append(identities, signingIdentity)
	}
	var contextOptions []fabsdk.ContextOption
	for _, identity := range identities {
		contextOptions = append(contextOptions, fabsdk.WithIdentity(identity))
	}
	contextOptions = append(contextOptions)
	clientProvider := r.FabricSDK.Context(contextOptions...)
	resmgmtClient, err := resmgmt.New(clientProvider)
	if err != nil {
		return nil, err
	}
	block, err := resmgmtClient.QueryConfigBlockFromOrderer(input.Name)
	if err != nil {
		return nil, err
	}
	cfgBlock, err := resource.ExtractConfigFromBlock(block)
	if err != nil {
		return nil, err
	}
	blockBytes, err := base64.StdEncoding.DecodeString(input.Block)
	if err != nil {
		return nil, err
	}
	updatedConfig := &cb.Config{}
	err = proto.Unmarshal(blockBytes, updatedConfig)
	if err != nil {
		return nil, err
	}
	configUpdate, err := resmgmt.CalculateConfigUpdate(input.Name, cfgBlock, updatedConfig)
	if err != nil {
		return nil, err
	}
	channelConfigBytes, err := CreateConfigUpdateEnvelope(input.Name, configUpdate)
	if err != nil {
		return nil, err
	}
	var requestOptions []resmgmt.RequestOption
	for _, rawSignature := range input.RawSignatures {
		configSignatureBytes, err := base64.StdEncoding.DecodeString(rawSignature.Raw)
		if err != nil {
			return nil, err
		}
		configSignature := &cb.ConfigSignature{}
		err = proto.Unmarshal(configSignatureBytes, configSignature)
		requestOptions = append(requestOptions, resmgmt.WithConfigSignatures(configSignature))
	}
	configUpdateReader := bytes.NewReader(channelConfigBytes)
	chResponse, err := resmgmtClient.SaveChannel(
		resmgmt.SaveChannelRequest{
			ChannelID:         input.Name,
			ChannelConfig:     configUpdateReader,
			SigningIdentities: identities,
		},
		requestOptions...,
	)
	if err != nil {
		return nil, err
	}
	return &models.UpdateChannelResponse{
		Errors:        []*models.Error{},
		TransactionID: string(chResponse.TransactionID),
	}, nil

}

func CreateConfigUpdateEnvelope(channelID string, configUpdate *cb.ConfigUpdate) ([]byte, error) {
	configUpdate.ChannelId = channelID
	configUpdateData, err := proto.Marshal(configUpdate)
	if err != nil {
		return nil, err
	}
	configUpdateEnvelope := &cb.ConfigUpdateEnvelope{}
	configUpdateEnvelope.ConfigUpdate = configUpdateData
	envelope, err := protoutil.CreateSignedEnvelope(cb.HeaderType_CONFIG_UPDATE, channelID, nil, configUpdateEnvelope, 0, 0)
	if err != nil {
		return nil, err
	}
	envelopeData, err := proto.Marshal(envelope)
	if err != nil {
		return nil, err
	}
	return envelopeData, nil
}
