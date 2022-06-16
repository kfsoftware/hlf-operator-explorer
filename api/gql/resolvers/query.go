package resolvers

import (
	"bytes"
	"context"
	"crypto/x509"
	"encoding/base64"
	"fmt"
	"github.com/golang/protobuf/proto"
	"github.com/hyperledger/fabric-config/configtx"
	"github.com/hyperledger/fabric-config/protolator"
	cb "github.com/hyperledger/fabric-protos-go/common"
	"github.com/hyperledger/fabric-protos-go/msp"
	pb "github.com/hyperledger/fabric-protos-go/peer"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/ledger"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/resmgmt"
	"github.com/hyperledger/fabric-sdk-go/pkg/fab/resource"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/models"
	"github.com/kfsoftware/hlf-operator-ui/api/log"
	"github.com/kfsoftware/hlf-operator-ui/api/pkg/block"
	"github.com/kfsoftware/hlf-operator/api/hlf.kungfusoftware.es/v1alpha1"
	"github.com/kfsoftware/hlf-operator/controllers/utils"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"gopkg.in/yaml.v3"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func mapPeer(peer v1alpha1.FabricPeer) (*models.Peer, error) {
	yamlBytes, err := yaml.Marshal(peer)
	if err != nil {
		return nil, err
	}
	return &models.Peer{
		Name:      peer.Name,
		Namespace: peer.Namespace,
		Yaml:      string(yamlBytes),
	}, nil
}
func (r *queryResolver) Peers(ctx context.Context) ([]*models.Peer, error) {
	peers, err := r.HLFClient.HlfV1alpha1().FabricPeers("").List(ctx, v1.ListOptions{})
	if err != nil {
		return nil, err
	}
	peerList := make([]*models.Peer, len(peers.Items))
	for i, peer := range peers.Items {
		peerGQL, err := mapPeer(peer)
		if err != nil {
			return nil, err
		}
		peerList[i] = peerGQL
	}
	return peerList, nil
}

func (r *queryResolver) Peer(ctx context.Context, input models.NameAndNamespace) (*models.Peer, error) {
	peer, err := r.HLFClient.HlfV1alpha1().FabricPeers(input.Namespace).Get(ctx, input.Name, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	peerGQL, err := mapPeer(*peer)
	if err != nil {
		return nil, err
	}
	return peerGQL, nil
}

func mapOrderer(ordererNode v1alpha1.FabricOrdererNode) (*models.Orderer, error) {
	yamlBytes, err := yaml.Marshal(ordererNode)
	if err != nil {
		return nil, err
	}
	return &models.Orderer{
		Name:      ordererNode.Name,
		Namespace: ordererNode.Namespace,
		Yaml:      string(yamlBytes),
	}, nil
}

func (r *queryResolver) Orderers(ctx context.Context) ([]*models.Orderer, error) {
	orderers, err := r.HLFClient.HlfV1alpha1().FabricOrdererNodes("").List(ctx, v1.ListOptions{})
	if err != nil {
		return nil, err
	}
	ordererList := make([]*models.Orderer, len(orderers.Items))
	for i, orderer := range orderers.Items {
		ordererGQL, err := mapOrderer(orderer)
		if err != nil {
			return nil, err
		}
		ordererList[i] = ordererGQL
	}
	return ordererList, nil
}

func (r *queryResolver) Orderer(ctx context.Context, input models.NameAndNamespace) (*models.Orderer, error) {
	orderer, err := r.HLFClient.HlfV1alpha1().FabricOrdererNodes(input.Namespace).Get(ctx, input.Name, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	ordererGQL, err := mapOrderer(*orderer)
	if err != nil {
		return nil, err
	}
	return ordererGQL, nil
}

func mapCA(ca v1alpha1.FabricCA) (*models.Ca, error) {
	yamlBytes, err := yaml.Marshal(ca)
	if err != nil {
		return nil, err
	}
	return &models.Ca{
		Name:      ca.Name,
		Namespace: ca.Namespace,
		Yaml:      string(yamlBytes),
	}, nil
}

func (r *queryResolver) Cas(ctx context.Context) ([]*models.Ca, error) {
	cas, err := r.HLFClient.HlfV1alpha1().FabricCAs("").List(ctx, v1.ListOptions{})
	if err != nil {
		return nil, err
	}
	caList := make([]*models.Ca, len(cas.Items))
	for i, ca := range cas.Items {
		caGQL, err := mapCA(ca)
		if err != nil {
			return nil, err
		}
		caList[i] = caGQL
	}
	return caList, nil
}

func (r *queryResolver) Ca(ctx context.Context, input models.NameAndNamespace) (*models.Ca, error) {
	ca, err := r.HLFClient.HlfV1alpha1().FabricCAs(input.Namespace).Get(ctx, input.Name, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	casGQL, err := mapCA(*ca)
	if err != nil {
		return nil, err
	}
	return casGQL, nil
}

func (r *queryResolver) Namespaces(ctx context.Context) ([]*models.Namespace, error) {
	namespaces, err := r.KubeClient.CoreV1().Namespaces().List(ctx, v1.ListOptions{})
	if err != nil {
		return nil, err
	}
	namespaceList := make([]*models.Namespace, len(namespaces.Items))
	for i, namespace := range namespaces.Items {
		namespaceList[i] = &models.Namespace{
			Name: namespace.Name,
		}
	}
	return namespaceList, nil
}
func (r Resolver) getPeers() []Peer {
	peersValue, _ := r.ConfigBackends[0].Lookup(fmt.Sprintf("organizations.%s.peers", r.MSPID))
	peersMap := peersValue.([]interface{})
	var peers []Peer
	for _, peerName := range peersMap {
		peers = append(peers, Peer{
			Name: peerName.(string),
		})
	}
	return peers
}

type Peer struct {
	Name string `json:"name"`
}

func (r *queryResolver) Channels(ctx context.Context) ([]*models.LightChannel, error) {
	peers := r.getPeers()
	firstPeerName := peers[0].Name
	ctxProvider := r.FabricSDK.Context(fabsdk.WithUser(r.User), fabsdk.WithOrg(r.MSPID))
	rsmgmtClient, err := resmgmt.New(ctxProvider)
	if err != nil {
		return nil, err
	}
	channelResponse, err := rsmgmtClient.QueryChannels(
		resmgmt.WithTargetEndpoints(firstPeerName),
	)
	if err != nil {
		return nil, err
	}

	var channelsGQL []*models.LightChannel
	for _, ch := range channelResponse.Channels {
		channelsGQL = append(channelsGQL, &models.LightChannel{Name: ch.ChannelId})
	}
	return channelsGQL, nil
}

func (r *queryResolver) Channel(ctx context.Context, channelID string) (*models.Channel, error) {

	ctxProvider := r.FabricSDK.Context(fabsdk.WithUser(r.User), fabsdk.WithOrg(r.MSPID))
	rsmgmtClient, err := resmgmt.New(ctxProvider)
	if err != nil {
		return nil, err
	}
	blck, err := rsmgmtClient.QueryConfigBlockFromOrderer(channelID)
	if err != nil {
		return nil, err
	}
	var buffer bytes.Buffer
	protoBytes, err := proto.Marshal(blck)
	if err != nil {
		return nil, err
	}
	protoBytesB64 := base64.StdEncoding.EncodeToString(protoBytes)
	err = protolator.DeepMarshalJSON(&buffer, blck)
	if err != nil {
		return nil, err
	}
	cfgBlock, err := resource.ExtractConfigFromBlock(blck)
	if err != nil {
		return nil, err
	}
	cftxGen := configtx.New(cfgBlock)
	channelProvider := r.FabricSDK.ChannelContext(channelID, fabsdk.WithUser(r.User), fabsdk.WithOrg(r.MSPID))
	ledgerClient, err := ledger.New(channelProvider)
	if err != nil {
		return nil, err
	}
	chInfo, err := ledgerClient.QueryInfo()
	if err != nil {
		return nil, err
	}
	channel := models.Channel{
		RawConfig:     buffer.String(),
		ProtoConfig:   protoBytesB64,
		Name:          channelID,
		Orderer:       &models.OrdererConfig{},
		Application:   &models.ApplicationConfig{},
		Height:        int(chInfo.BCI.Height),
		ChannelConfig: &models.ChannelConfig{},
	}
	o, err := cftxGen.Orderer().Configuration()
	if err != nil {
		return nil, err
	}
	channel.Orderer.MaxChannels = int(o.MaxChannels)
	channel.Orderer.BatchTimeout = int(o.BatchTimeout.Milliseconds())
	channel.Orderer.State = string(o.State)
	channel.Orderer.Capabilities = o.Capabilities
	channel.Orderer.Type = o.OrdererType
	channel.Orderer.Policies = mapPolicies(o.Policies)
	channel.Orderer.BatchSize = &models.OrdererConfigBatchSize{
		MaxMessageCount:   int(o.BatchSize.MaxMessageCount),
		AbsoluteMaxBytes:  int(o.BatchSize.AbsoluteMaxBytes),
		PreferredMaxBytes: int(o.BatchSize.PreferredMaxBytes),
	}
	channel.Orderer.Organizations = mapConfigtxToChannelsOrg(o.Organizations)

	var configRaftConsenters []*models.OrdererConfigRaftConsenter
	for _, consenter := range o.EtcdRaft.Consenters {
		configRaftConsenters = append(configRaftConsenters, &models.OrdererConfigRaftConsenter{
			Address: &models.NetworkAddress{
				Host: consenter.Address.Host,
				Port: consenter.Address.Port,
			},
			ClientTLSCert: string(utils.EncodeX509Certificate(consenter.ClientTLSCert)),
			ServerTLSCert: string(utils.EncodeX509Certificate(consenter.ServerTLSCert)),
		})
	}

	channel.Orderer.EtcdDraft = &models.OrdererConfigRaft{
		Consenters: configRaftConsenters,
		Options: &models.OrdererConfigRaftOptions{
			TickInterval:         o.EtcdRaft.Options.TickInterval,
			ElectionTick:         int(o.EtcdRaft.Options.ElectionTick),
			HeartbeatTick:        int(o.EtcdRaft.Options.HeartbeatTick),
			MaxInflightBlocks:    int(o.EtcdRaft.Options.MaxInflightBlocks),
			SnapshotIntervalSize: int(o.EtcdRaft.Options.SnapshotIntervalSize),
		},
	}

	a, err := cftxGen.Application().Configuration()
	if err != nil {
		return nil, err
	}
	channel.Application.Organizations = mapConfigtxToChannelsOrg(a.Organizations)
	channel.Application.Policies = mapPolicies(a.Policies)
	channel.Application.Acls = mapACLs(a.ACLs)
	channel.Application.Capabilities = a.Capabilities
	chConfig, err := cftxGen.Channel().Configuration()
	if err != nil {
		return nil, err
	}
	channel.ChannelConfig.Policies = mapPolicies(chConfig.Policies)
	channel.ChannelConfig.Capabilities = chConfig.Capabilities
	//
	//committedCCs, err := rsmgmtClient.LifecycleQueryCommittedCC(
	//	channelID,
	//	resmgmt.LifecycleQueryCommittedCCRequest{Name: ""},
	//	opts...,
	//)
	//if err != nil {
	//	return nil, err
	//}
	//var ccChannels []*models.ChannelChaincode
	//for _, c := range committedCCs {
	//	signaturePolicy, err := mapSignaturePolicy(c.SignaturePolicy)
	//	if err != nil {
	//		return nil, err
	//	}
	//	ccChannels = append(ccChannels, &models.ChannelChaincode{
	//		Name:                   c.Name,
	//		Version:                c.Version,
	//		Sequence:               int(c.Sequence),
	//		SignaturePolicy:        signaturePolicy,
	//		EndorsementPlugin:      c.EndorsementPlugin,
	//		ValidationPlugin:       c.ValidationPlugin,
	//		ConfigPolicy:           c.ChannelConfigPolicy,
	//		PrivateDataCollections: mapPDCs(c.CollectionConfig),
	//		Approvals:              mapChaincodeApprovals(c.Approvals),
	//	})
	//}
	//channel.Chaincodes = ccChannels
	return &channel, nil
}
func EncodeX509CertificatesToPem(crts []*x509.Certificate) []string {
	var pems []string
	for _, crt := range crts {
		pems = append(pems, string(utils.EncodeX509Certificate(crt)))
	}

	return pems
}
func mapPDCEndorsementPolicy(policy *pb.ApplicationPolicy) (*models.ApplicationPolicy, error) {
	var err error
	sp, spOk := policy.Type.(*pb.ApplicationPolicy_SignaturePolicy)
	ccpr, ccprOk := policy.Type.(*pb.ApplicationPolicy_ChannelConfigPolicyReference)
	var spGQl *models.SignaturePolicy
	var ccprRef string
	if spOk {
		spGQl, err = mapSignaturePolicy(sp.SignaturePolicy)
		if err != nil {
			return nil, err
		}
	}
	if ccprOk {
		ccprRef = ccpr.ChannelConfigPolicyReference
	}
	return &models.ApplicationPolicy{
		ChannelConfigPolicy: ccprRef,
		SignaturePolicy:     spGQl,
	}, nil
}
func mapPDCs(config []*pb.CollectionConfig) []*models.PrivateDataCollection {
	var pdcs []*models.PrivateDataCollection
	var err error
	for _, cc := range config {
		scc, ok := cc.Payload.(*pb.CollectionConfig_StaticCollectionConfig)
		if !ok {
			log.Warnf("Couldn't cast payload %v to CollectionConfig_StaticCollectionConfig", cc.Payload)
			continue
		}
		var policy *models.ApplicationPolicy
		if scc.StaticCollectionConfig.EndorsementPolicy != nil {
			policy, err = mapPDCEndorsementPolicy(scc.StaticCollectionConfig.EndorsementPolicy)
			if err != nil {
				log.Warnf("Failed to parse endorsement policy: %v", err)
			}
		}
		var memberOrgsGQL *models.SignaturePolicy

		memberOrgsSignaturePolicy := scc.StaticCollectionConfig.MemberOrgsPolicy.GetSignaturePolicy()
		if memberOrgsSignaturePolicy != nil {
			memberOrgsGQL, err = mapSignaturePolicy(memberOrgsSignaturePolicy)
			if err != nil {
				log.Warnf("Failed to parse member orgs policy: %v", err)
			}
		}
		pdcs = append(pdcs, &models.PrivateDataCollection{
			Name:              scc.StaticCollectionConfig.Name,
			RequiredPeerCount: int(scc.StaticCollectionConfig.RequiredPeerCount),
			MaxPeerCount:      int(scc.StaticCollectionConfig.MaximumPeerCount),
			BlockToLive:       int(scc.StaticCollectionConfig.BlockToLive),
			MemberOnlyRead:    scc.StaticCollectionConfig.MemberOnlyRead,
			MemberOnlyWrite:   scc.StaticCollectionConfig.MemberOnlyWrite,
			EndorsementPolicy: policy,
			MemberOrgsPolicy:  memberOrgsGQL,
		})
	}
	return pdcs
}

func mapSignaturePolicyRule(rule *cb.SignaturePolicy) (*models.SignaturePolicyRule, error) {
	var signaturePolicyType string
	var noutOfSignaturePolicy *models.SignaturePolicyNOutOf
	var signedBySignaturePolicy *models.SignaturePolicySignedBy
	noutOf, noutOfOk := rule.Type.(*cb.SignaturePolicy_NOutOf_)
	signedBy, signedByOk := rule.Type.(*cb.SignaturePolicy_SignedBy)
	if noutOfOk {
		signaturePolicyType = "N_OUT_OF"
		var rules []*models.SignaturePolicyRule
		for _, policy := range noutOf.NOutOf.Rules {
			r, err := mapSignaturePolicyRule(policy)
			if err != nil {
				continue
			}
			rules = append(rules, r)
		}
		noutOfSignaturePolicy = &models.SignaturePolicyNOutOf{
			N:     int(noutOf.NOutOf.N),
			Rules: rules,
		}
	}
	if signedByOk {
		signaturePolicyType = "SIGNED_BY"
		signedBySignaturePolicy = &models.SignaturePolicySignedBy{
			SignedBy: int(signedBy.SignedBy),
		}
	}
	s := &models.SignaturePolicyRule{
		Type:     signaturePolicyType,
		NoutOf:   noutOfSignaturePolicy,
		SignedBy: signedBySignaturePolicy,
	}
	return s, nil
}

func mapSignaturePolicy(policy *cb.SignaturePolicyEnvelope) (*models.SignaturePolicy, error) {
	r, err := mapSignaturePolicyRule(policy.Rule)
	if err != nil {
		return nil, err
	}
	var principals []*models.MSPPrincipal
	for _, identity := range policy.Identities {
		mspPrincipal, err := mapMSPPrincipal(identity)
		if err != nil {
			log.Warnf("Failed to parse principal:%v", err)
			continue
		}
		principals = append(principals, mspPrincipal)
	}
	s := &models.SignaturePolicy{
		Version:    int(policy.Version),
		Rule:       r,
		Principals: principals,
	}
	return s, nil
}
func mapMSPPrincipal(identity *msp.MSPPrincipal) (*models.MSPPrincipal, error) {
	var mspPrincipals []*models.MSPPrincipal
	var principalRole *models.MSPPrincipalRole
	var principalCombined *models.MSPPrincipalCombined
	switch identity.PrincipalClassification {
	case msp.MSPPrincipal_ROLE:
		msprole := &msp.MSPRole{}
		err := proto.Unmarshal(identity.Principal, msprole)
		if err != nil {
			return nil, errors.Wrapf(err, "cannot unmarshal identities")
		}
		principalRole = &models.MSPPrincipalRole{
			MspID: msprole.MspIdentifier,
			Role:  msprole.Role.String(),
		}
	case msp.MSPPrincipal_ORGANIZATION_UNIT:
	case msp.MSPPrincipal_IDENTITY:
	case msp.MSPPrincipal_ANONYMITY:
	case msp.MSPPrincipal_COMBINED:
		combinedPrincipals := &msp.CombinedPrincipal{}
		err := proto.Unmarshal(identity.Principal, combinedPrincipals)
		if err != nil {
			return nil, errors.Wrap(err, "could not unmarshal CombinedPrincipal from principal")
		}
		for _, cp := range combinedPrincipals.Principals {
			p, err := mapMSPPrincipal(cp)
			if err != nil {
				log.Warnf("Failed to parse principal:%v", err)
				continue
			}
			mspPrincipals = append(mspPrincipals, p)
		}
		principalCombined = &models.MSPPrincipalCombined{
			Classification: identity.PrincipalClassification.String(),
			MspPrincipals:  mspPrincipals,
		}
	}

	return &models.MSPPrincipal{
		Combined: principalCombined,
		Role:     principalRole,
	}, nil
}

func mapChaincodeApprovals(approvals map[string]bool) []*models.ChaincodeApproval {
	var chaincodeApprovals []*models.ChaincodeApproval
	for mspID, approved := range approvals {
		chaincodeApprovals = append(chaincodeApprovals, &models.ChaincodeApproval{
			MspID:    mspID,
			Approved: approved,
		})
	}
	return chaincodeApprovals
}

func mapACLs(acls map[string]string) []*models.ChannelACL {
	var channelACLs []*models.ChannelACL
	for key, value := range acls {
		channelACLs = append(channelACLs, &models.ChannelACL{
			Key:   key,
			Value: value,
		})
	}
	return channelACLs
}
func mapConfigtxToChannelsOrg(configtxOrgs []configtx.Organization) []*models.ChannelOrg {
	var channelOrgs []*models.ChannelOrg
	for _, configtxOrg := range configtxOrgs {
		channelOrgs = append(channelOrgs, mapConfigtxToChannelOrg(configtxOrg))
	}
	return channelOrgs
}

func mapConfigtxToChannelOrg(o configtx.Organization) *models.ChannelOrg {
	var anchorPeers []*models.NetworkAddress
	for _, anchorPeer := range o.AnchorPeers {
		anchorPeers = append(anchorPeers, &models.NetworkAddress{
			Host: anchorPeer.Host,
			Port: anchorPeer.Port,
		})
	}
	msp := &models.ChannelMsp{
		Name:                 o.MSP.Name,
		RootCerts:            EncodeX509CertificatesToPem(o.MSP.RootCerts),
		IntermediateCerts:    EncodeX509CertificatesToPem(o.MSP.IntermediateCerts),
		Admins:               EncodeX509CertificatesToPem(o.MSP.Admins),
		RevocationList:       []string{},
		TLSRootCerts:         EncodeX509CertificatesToPem(o.MSP.TLSRootCerts),
		TLSIntermediateCerts: EncodeX509CertificatesToPem(o.MSP.TLSIntermediateCerts),
	}
	nodeOUs := &models.NodeOUs{
		Enable: o.MSP.NodeOUs.Enable,
		ClientOUIdentifier: &models.OUIdentifier{
			Certificate:  string(utils.EncodeX509Certificate(o.MSP.NodeOUs.ClientOUIdentifier.Certificate)),
			OuIdentifier: o.MSP.NodeOUs.ClientOUIdentifier.OrganizationalUnitIdentifier,
		},
		PeerOUIdentifier: &models.OUIdentifier{
			Certificate:  string(utils.EncodeX509Certificate(o.MSP.NodeOUs.PeerOUIdentifier.Certificate)),
			OuIdentifier: o.MSP.NodeOUs.PeerOUIdentifier.OrganizationalUnitIdentifier,
		},
		AdminOUIdentifier: &models.OUIdentifier{
			Certificate:  string(utils.EncodeX509Certificate(o.MSP.NodeOUs.AdminOUIdentifier.Certificate)),
			OuIdentifier: o.MSP.NodeOUs.AdminOUIdentifier.OrganizationalUnitIdentifier,
		},
		OrdererOUIdentifier: &models.OUIdentifier{
			Certificate:  string(utils.EncodeX509Certificate(o.MSP.NodeOUs.OrdererOUIdentifier.Certificate)),
			OuIdentifier: o.MSP.NodeOUs.OrdererOUIdentifier.OrganizationalUnitIdentifier,
		},
	}
	signatureHashFamiliy := o.MSP.CryptoConfig.SignatureHashFamily
	if signatureHashFamiliy == "" {
		signatureHashFamiliy = "SHA2"
	}
	identityIdentifierHashFunction := o.MSP.CryptoConfig.SignatureHashFamily
	if identityIdentifierHashFunction == "" {
		identityIdentifierHashFunction = "SHA256"
	}
	cryptoConfig := &models.CryptoConfig{
		SignatureHashFamily:            signatureHashFamiliy,
		IdentityIdentifierHashFunction: identityIdentifierHashFunction,
	}

	var ous []*models.OUIdentifier
	for _, ouIdentifier := range o.MSP.OrganizationalUnitIdentifiers {
		ous = append(ous, &models.OUIdentifier{
			Certificate:  string(utils.EncodeX509Certificate(ouIdentifier.Certificate)),
			OuIdentifier: ouIdentifier.OrganizationalUnitIdentifier,
		})
	}
	return &models.ChannelOrg{
		MspID:            o.Name,
		Policies:         mapPolicies(o.Policies),
		Msp:              msp,
		ModPolicy:        o.ModPolicy,
		OrdererEndpoints: o.OrdererEndpoints,
		AnchorPeer:       anchorPeers,
		NodeOUs:          nodeOUs,
		CryptoConfig:     cryptoConfig,
		Ous:              ous,
	}
}

func mapPolicies(configTxPolicies map[string]configtx.Policy) []*models.ChannelPolicy {
	var policies []*models.ChannelPolicy
	for key, policy := range configTxPolicies {
		policies = append(policies, &models.ChannelPolicy{
			Key:       key,
			Type:      policy.Type,
			Rule:      policy.Rule,
			ModPolicy: policy.ModPolicy,
		})
	}
	return policies
}
func (r *queryResolver) Blocks(ctx context.Context, channelID string, from int, to int, reverse bool) (*models.BlocksResponse, error) {
	chContext := r.FabricSDK.ChannelContext(channelID, fabsdk.WithUser(r.User), fabsdk.WithOrg(r.MSPID))
	ledgerClient, err := ledger.New(chContext)
	if err != nil {
		return nil, err
	}
	var totalBlocks []*block.Block
	var blockNumbers []int
	height := 0
	if reverse {
		info, err := ledgerClient.QueryInfo()
		if err != nil {
			return nil, err
		}
		chHeight := int(info.BCI.Height) - 1
		for i := from; i < to; i++ {
			blkNmbr := chHeight - i
			if blkNmbr >= 0 {
				blockNumbers = append(blockNumbers, blkNmbr)
			}
		}
		height = chHeight
	} else {
		for blkNmbr := from; blkNmbr < to; blkNmbr++ {
			blockNumbers = append(blockNumbers, blkNmbr)
		}
	}
	for _, blockNumber := range blockNumbers {
		blck, err := block.GetBlock(ledgerClient, blockNumber)
		if err != nil {
			return nil, err
		}
		totalBlocks = append(totalBlocks, blck)
		logrus.Debugf("block number %d", blck.Number)
	}
	var gqlBlocks []*models.Block
	for _, blck := range totalBlocks {
		gqlBlocks = append(gqlBlocks, mapBlock(blck))
	}
	return &models.BlocksResponse{
		Height: height,
		Blocks: gqlBlocks,
	}, nil
}
func mapBlock(blck *block.Block) *models.Block {
	var transactions []*models.Transaction
	for _, tx := range blck.Transactions {
		transactions = append(transactions, mapTransaction(tx))
	}
	return &models.Block{
		BlockNumber:     blck.Number,
		DataHash:        blck.DataHash,
		NumTransactions: len(blck.Transactions),
		CreatedAt:       *blck.CreatedAt,
		Transactions:    transactions,
	}
}

func mapTransaction(tx *block.Transaction) *models.Transaction {
	response := string(tx.Response)
	request := string(tx.Request)
	var reads []*models.TransactionRead
	for _, read := range tx.Reads {
		reads = append(reads, &models.TransactionRead{
			ChaincodeID:     read.ChaincodeID,
			Key:             read.Key,
			BlockNumVersion: &read.BlockNumVersion,
			TxNumVersion:    &read.TxNumVersion,
		})
	}
	var writes []*models.TransactionWrite
	for _, write := range tx.Writes {
		writes = append(writes, &models.TransactionWrite{
			ChaincodeID: write.ChaincodeID,
			Deleted:     write.Deleted,
			Key:         write.Key,
			Value:       write.Value,
		})
	}
	return &models.Transaction{
		TxID:      tx.ID,
		Type:      models.TransactionType(tx.Type),
		CreatedAt: tx.CreatedAt,
		Version:   tx.Version,
		Path:      &tx.Path,
		Response:  &response,
		Request:   &request,
		Chaincode: tx.ChaincodeID,
		Writes:    writes,
		Reads:     reads,
	}
}
func (r *queryResolver) Block(ctx context.Context, channelID string, blockNumber int) (*models.Block, error) {
	chContext := r.FabricSDK.ChannelContext(channelID, fabsdk.WithUser(r.User), fabsdk.WithOrg(r.MSPID))
	ledgerClient, err := ledger.New(chContext)
	if err != nil {
		return nil, err
	}
	var totalBlocks []*block.Block
	blck, err := block.GetBlock(ledgerClient, blockNumber)
	if err != nil {
		return nil, err
	}
	totalBlocks = append(totalBlocks, blck)
	return mapBlock(blck), nil
}
