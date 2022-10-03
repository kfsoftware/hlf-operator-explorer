// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package models

import (
	"fmt"
	"io"
	"strconv"
	"time"
)

type ApplicationConfig struct {
	Policies      []*ChannelPolicy `json:"policies"`
	Acls          []*ChannelACL    `json:"acls"`
	Capabilities  []string         `json:"capabilities"`
	Organizations []*ChannelOrg    `json:"organizations"`
}

type ApplicationPolicy struct {
	ChannelConfigPolicy string           `json:"channelConfigPolicy"`
	SignaturePolicy     *SignaturePolicy `json:"signaturePolicy"`
}

type Block struct {
	BlockNumber     int            `json:"blockNumber"`
	DataHash        string         `json:"dataHash"`
	NumTransactions int            `json:"numTransactions"`
	CreatedAt       time.Time      `json:"createdAt"`
	Transactions    []*Transaction `json:"transactions"`
}

type BlockWithPrivateData struct {
	BlockNumber     int                           `json:"blockNumber"`
	DataHash        string                        `json:"dataHash"`
	NumTransactions int                           `json:"numTransactions"`
	CreatedAt       time.Time                     `json:"createdAt"`
	Transactions    []*TransactionWithPrivateData `json:"transactions"`
}

type BlocksResponse struct {
	Height int      `json:"height"`
	Blocks []*Block `json:"blocks"`
}

type CAStorage struct {
	Ca *StorageUsage `json:"ca"`
}

type ChaincodeApproval struct {
	MspID    string `json:"mspID"`
	Approved bool   `json:"approved"`
}

type ChannelACL struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type ChannelAnchorPeer struct {
	MspID string `json:"mspID"`
	Host  string `json:"host"`
	Port  int    `json:"port"`
}

type ChannelChaincode struct {
	Name                   string                   `json:"name"`
	Version                string                   `json:"version"`
	Sequence               int                      `json:"sequence"`
	SignaturePolicy        *SignaturePolicy         `json:"signaturePolicy"`
	EndorsementPlugin      string                   `json:"endorsementPlugin"`
	ValidationPlugin       string                   `json:"validationPlugin"`
	ConfigPolicy           string                   `json:"configPolicy"`
	PrivateDataCollections []*PrivateDataCollection `json:"privateDataCollections"`
	Approvals              []*ChaincodeApproval     `json:"approvals"`
}

type ChannelConfig struct {
	Policies     []*ChannelPolicy `json:"policies"`
	Capabilities []string         `json:"capabilities"`
}

type ChannelMsp struct {
	Name                 string   `json:"name"`
	RootCerts            []string `json:"rootCerts"`
	IntermediateCerts    []string `json:"intermediateCerts"`
	Admins               []string `json:"admins"`
	RevocationList       []string `json:"revocationList"`
	TLSRootCerts         []string `json:"tlsRootCerts"`
	TLSIntermediateCerts []string `json:"tlsIntermediateCerts"`
}

type ChannelOrg struct {
	ModPolicy        string            `json:"modPolicy"`
	MspID            string            `json:"mspID"`
	Policies         []*ChannelPolicy  `json:"policies"`
	Msp              *ChannelMsp       `json:"msp"`
	OrdererEndpoints []string          `json:"ordererEndpoints"`
	AnchorPeer       []*NetworkAddress `json:"anchorPeer"`
	NodeOUs          *NodeOUs          `json:"nodeOUs"`
	CryptoConfig     *CryptoConfig     `json:"cryptoConfig"`
	Ous              []*OUIdentifier   `json:"ous"`
}

type ChannelPeer struct {
	MspID  string `json:"mspID"`
	URL    string `json:"url"`
	Height int    `json:"height"`
}

type ChannelPolicy struct {
	Key       string `json:"key"`
	Type      string `json:"type"`
	Rule      string `json:"rule"`
	ModPolicy string `json:"modPolicy"`
}

type CreateCAInput struct {
	Yaml string `json:"yaml"`
}

type CreateOrdererInput struct {
	Yaml string `json:"yaml"`
}

type CreatePeerInput struct {
	Yaml string `json:"yaml"`
}

type CryptoConfig struct {
	SignatureHashFamily            string `json:"signatureHashFamily"`
	IdentityIdentifierHashFunction string `json:"identityIdentifierHashFunction"`
}

type LightChannel struct {
	Name string `json:"name"`
}

type MSPPrincipal struct {
	Combined *MSPPrincipalCombined `json:"combined"`
	Role     *MSPPrincipalRole     `json:"role"`
}

type MSPPrincipalCombined struct {
	Classification string          `json:"classification"`
	MspPrincipals  []*MSPPrincipal `json:"mspPrincipals"`
}

type MSPPrincipalRole struct {
	MspID string `json:"mspID"`
	Role  string `json:"role"`
}

type NameAndNamespace struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

type Namespace struct {
	Name string `json:"name"`
}

type NetworkAddress struct {
	Host string `json:"host"`
	Port int    `json:"port"`
}

type NodeOUs struct {
	Enable              bool          `json:"enable"`
	ClientOUIdentifier  *OUIdentifier `json:"clientOUIdentifier"`
	PeerOUIdentifier    *OUIdentifier `json:"peerOUIdentifier"`
	AdminOUIdentifier   *OUIdentifier `json:"adminOUIdentifier"`
	OrdererOUIdentifier *OUIdentifier `json:"ordererOUIdentifier"`
}

type OUIdentifier struct {
	Certificate  string `json:"certificate"`
	OuIdentifier string `json:"ouIdentifier"`
}

type OrdererConfig struct {
	Type          string                  `json:"type"`
	BatchTimeout  int                     `json:"batchTimeout"`
	BatchSize     *OrdererConfigBatchSize `json:"batchSize"`
	MaxChannels   int                     `json:"maxChannels"`
	Capabilities  []string                `json:"capabilities"`
	State         string                  `json:"state"`
	Policies      []*ChannelPolicy        `json:"policies"`
	EtcdDraft     *OrdererConfigRaft      `json:"etcdDraft"`
	Organizations []*ChannelOrg           `json:"organizations"`
}

type OrdererConfigBatchSize struct {
	MaxMessageCount   int `json:"maxMessageCount"`
	AbsoluteMaxBytes  int `json:"absoluteMaxBytes"`
	PreferredMaxBytes int `json:"preferredMaxBytes"`
}

type OrdererConfigRaft struct {
	Consenters []*OrdererConfigRaftConsenter `json:"consenters"`
	Options    *OrdererConfigRaftOptions     `json:"options"`
}

type OrdererConfigRaftConsenter struct {
	Address       *NetworkAddress `json:"address"`
	ClientTLSCert string          `json:"clientTlsCert"`
	ServerTLSCert string          `json:"serverTlsCert"`
}

type OrdererConfigRaftOptions struct {
	TickInterval         string `json:"tickInterval"`
	ElectionTick         int    `json:"electionTick"`
	HeartbeatTick        int    `json:"heartbeatTick"`
	MaxInflightBlocks    int    `json:"maxInflightBlocks"`
	SnapshotIntervalSize int    `json:"snapshotIntervalSize"`
}

type OrdererStorage struct {
	Orderer *StorageUsage `json:"orderer"`
}

type PDCRead struct {
	CollectionName string `json:"collectionName"`
	Key            string `json:"key"`
	Block          int    `json:"block"`
	TxNum          int    `json:"txNum"`
}

type PDCReadHash struct {
	PdcName   string          `json:"pdcName"`
	KeyHash   string          `json:"keyHash"`
	RwSetHash string          `json:"rwSetHash"`
	Version   *PDCReadVersion `json:"version"`
}

type PDCReadVersion struct {
	BlockNum int `json:"blockNum"`
	TxNum    int `json:"txNum"`
}

type PDCWrite struct {
	CollectionName string `json:"collectionName"`
	Deleted        bool   `json:"deleted"`
	Key            string `json:"key"`
	Value          string `json:"value"`
}

type PDCWriteHash struct {
	PdcName   string `json:"pdcName"`
	KeyHash   string `json:"keyHash"`
	RwSetHash string `json:"rwSetHash"`
	ValueHash string `json:"valueHash"`
	IsDelete  bool   `json:"isDelete"`
	IsPurge   bool   `json:"isPurge"`
}

type PeerStorage struct {
	Chaincode *StorageUsage `json:"chaincode"`
	CouchDb   *StorageUsage `json:"couchDB"`
	Peer      *StorageUsage `json:"peer"`
}

type PrivateDataCollection struct {
	Name              string             `json:"name"`
	RequiredPeerCount int                `json:"requiredPeerCount"`
	MaxPeerCount      int                `json:"maxPeerCount"`
	BlockToLive       int                `json:"blockToLive"`
	MemberOnlyRead    bool               `json:"memberOnlyRead"`
	MemberOnlyWrite   bool               `json:"memberOnlyWrite"`
	EndorsementPolicy *ApplicationPolicy `json:"endorsementPolicy"`
	MemberOrgsPolicy  *SignaturePolicy   `json:"memberOrgsPolicy"`
}

type SignaturePolicy struct {
	Version    int                  `json:"version"`
	Rule       *SignaturePolicyRule `json:"rule"`
	Principals []*MSPPrincipal      `json:"principals"`
}

type SignaturePolicyNOutOf struct {
	N     int                    `json:"n"`
	Rules []*SignaturePolicyRule `json:"rules"`
}

type SignaturePolicyRule struct {
	Type     string                   `json:"type"`
	NoutOf   *SignaturePolicyNOutOf   `json:"noutOf"`
	SignedBy *SignaturePolicySignedBy `json:"signedBy"`
}

type SignaturePolicySignedBy struct {
	SignedBy int `json:"signedBy"`
}

type StorageClass struct {
	Name string `json:"name"`
}

type StorageUsage struct {
	Used           int     `json:"used"`
	UsedGb         string  `json:"usedGB"`
	Free           int     `json:"free"`
	FreeGb         string  `json:"freeGB"`
	Size           int     `json:"size"`
	SizeGb         string  `json:"sizeGB"`
	PercentageUsed float64 `json:"percentageUsed"`
}

type Transaction struct {
	TxID      string              `json:"txID"`
	Type      TransactionType     `json:"type"`
	CreatedAt time.Time           `json:"createdAt"`
	Version   string              `json:"version"`
	Path      *string             `json:"path"`
	Response  *string             `json:"response"`
	Request   *string             `json:"request"`
	Chaincode string              `json:"chaincode"`
	Writes    []*TransactionWrite `json:"writes"`
	Reads     []*TransactionRead  `json:"reads"`
}

type TransactionRead struct {
	ChaincodeID     string `json:"chaincodeID"`
	Key             string `json:"key"`
	BlockNumVersion *int   `json:"blockNumVersion"`
	TxNumVersion    *int   `json:"txNumVersion"`
}

type TransactionWithPrivateData struct {
	TxID           string              `json:"txID"`
	Type           TransactionType     `json:"type"`
	CreatedAt      time.Time           `json:"createdAt"`
	Version        string              `json:"version"`
	Path           *string             `json:"path"`
	Response       *string             `json:"response"`
	Request        *string             `json:"request"`
	Chaincode      string              `json:"chaincode"`
	Writes         []*TransactionWrite `json:"writes"`
	Reads          []*TransactionRead  `json:"reads"`
	PdcWrites      []*PDCWrite         `json:"pdcWrites"`
	PdcReads       []*PDCRead          `json:"pdcReads"`
	PdcWriteHashes []*PDCWriteHash     `json:"pdcWriteHashes"`
	PdcReadHashes  []*PDCReadHash      `json:"pdcReadHashes"`
}

type TransactionWrite struct {
	ChaincodeID string `json:"chaincodeID"`
	Deleted     bool   `json:"deleted"`
	Key         string `json:"key"`
	Value       string `json:"value"`
}

type UpdateCAInput struct {
	Yaml string `json:"yaml"`
}

type UpdateeOrdererInput struct {
	Yaml string `json:"yaml"`
}

type UpdateePeerInput struct {
	Yaml string `json:"yaml"`
}

type TransactionType string

const (
	TransactionTypeMessage             TransactionType = "MESSAGE"
	TransactionTypeConfig              TransactionType = "CONFIG"
	TransactionTypeConfigUpdate        TransactionType = "CONFIG_UPDATE"
	TransactionTypeEndorserTransaction TransactionType = "ENDORSER_TRANSACTION"
	TransactionTypeOrdererTransaction  TransactionType = "ORDERER_TRANSACTION"
	TransactionTypeDeliverSeekInfo     TransactionType = "DELIVER_SEEK_INFO"
	TransactionTypeChaincodePackage    TransactionType = "CHAINCODE_PACKAGE"
)

var AllTransactionType = []TransactionType{
	TransactionTypeMessage,
	TransactionTypeConfig,
	TransactionTypeConfigUpdate,
	TransactionTypeEndorserTransaction,
	TransactionTypeOrdererTransaction,
	TransactionTypeDeliverSeekInfo,
	TransactionTypeChaincodePackage,
}

func (e TransactionType) IsValid() bool {
	switch e {
	case TransactionTypeMessage, TransactionTypeConfig, TransactionTypeConfigUpdate, TransactionTypeEndorserTransaction, TransactionTypeOrdererTransaction, TransactionTypeDeliverSeekInfo, TransactionTypeChaincodePackage:
		return true
	}
	return false
}

func (e TransactionType) String() string {
	return string(e)
}

func (e *TransactionType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = TransactionType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid TransactionType", str)
	}
	return nil
}

func (e TransactionType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
