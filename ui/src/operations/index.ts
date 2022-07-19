import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
};


export type ApplicationConfig = {
  __typename?: 'ApplicationConfig';
  policies?: Maybe<Array<ChannelPolicy>>;
  acls?: Maybe<Array<ChannelAcl>>;
  capabilities?: Maybe<Array<Scalars['String']>>;
  organizations?: Maybe<Array<ChannelOrg>>;
};

export type ApplicationPolicy = {
  __typename?: 'ApplicationPolicy';
  channelConfigPolicy: Scalars['String'];
  signaturePolicy?: Maybe<SignaturePolicy>;
};

export type Block = {
  __typename?: 'Block';
  blockNumber: Scalars['Int'];
  dataHash: Scalars['String'];
  numTransactions: Scalars['Int'];
  createdAt: Scalars['Time'];
  transactions?: Maybe<Array<Transaction>>;
};

export type BlockWithPrivateData = {
  __typename?: 'BlockWithPrivateData';
  blockNumber: Scalars['Int'];
  dataHash: Scalars['String'];
  numTransactions: Scalars['Int'];
  createdAt: Scalars['Time'];
  transactions?: Maybe<Array<TransactionWithPrivateData>>;
};

export type BlocksResponse = {
  __typename?: 'BlocksResponse';
  height: Scalars['Int'];
  blocks?: Maybe<Array<Block>>;
};

export type Ca = {
  __typename?: 'CA';
  name: Scalars['String'];
  namespace: Scalars['String'];
  yaml: Scalars['String'];
};

export type ChaincodeApproval = {
  __typename?: 'ChaincodeApproval';
  mspID: Scalars['String'];
  approved: Scalars['Boolean'];
};

export type Channel = {
  __typename?: 'Channel';
  name: Scalars['String'];
  rawConfig: Scalars['String'];
  protoConfig: Scalars['String'];
  channelConfig: ChannelConfig;
  application?: Maybe<ApplicationConfig>;
  orderer: OrdererConfig;
  height: Scalars['Int'];
  chaincodes?: Maybe<Array<ChannelChaincode>>;
  peers?: Maybe<Array<ChannelPeer>>;
};

export type ChannelAcl = {
  __typename?: 'ChannelACL';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type ChannelAnchorPeer = {
  __typename?: 'ChannelAnchorPeer';
  mspID: Scalars['String'];
  host: Scalars['String'];
  port: Scalars['Int'];
};

export type ChannelChaincode = {
  __typename?: 'ChannelChaincode';
  name: Scalars['String'];
  version: Scalars['String'];
  sequence: Scalars['Int'];
  signaturePolicy: SignaturePolicy;
  endorsementPlugin: Scalars['String'];
  validationPlugin: Scalars['String'];
  configPolicy: Scalars['String'];
  privateDataCollections?: Maybe<Array<PrivateDataCollection>>;
  approvals?: Maybe<Array<ChaincodeApproval>>;
};

export type ChannelConfig = {
  __typename?: 'ChannelConfig';
  policies?: Maybe<Array<ChannelPolicy>>;
  capabilities?: Maybe<Array<Scalars['String']>>;
};

export type ChannelMsp = {
  __typename?: 'ChannelMSP';
  name: Scalars['String'];
  rootCerts?: Maybe<Array<Scalars['String']>>;
  intermediateCerts?: Maybe<Array<Scalars['String']>>;
  admins?: Maybe<Array<Scalars['String']>>;
  revocationList?: Maybe<Array<Scalars['String']>>;
  tlsRootCerts?: Maybe<Array<Scalars['String']>>;
  tlsIntermediateCerts?: Maybe<Array<Scalars['String']>>;
};

export type ChannelOrg = {
  __typename?: 'ChannelOrg';
  modPolicy: Scalars['String'];
  mspID: Scalars['String'];
  policies?: Maybe<Array<ChannelPolicy>>;
  msp: ChannelMsp;
  ordererEndpoints?: Maybe<Array<Scalars['String']>>;
  anchorPeer?: Maybe<Array<NetworkAddress>>;
  nodeOUs: NodeOUs;
  cryptoConfig: CryptoConfig;
  ous?: Maybe<Array<OuIdentifier>>;
};

export type ChannelPeer = {
  __typename?: 'ChannelPeer';
  mspID: Scalars['String'];
  url: Scalars['String'];
  height: Scalars['Int'];
};

export type ChannelPolicy = {
  __typename?: 'ChannelPolicy';
  key: Scalars['String'];
  type: Scalars['String'];
  rule: Scalars['String'];
  modPolicy: Scalars['String'];
};

export type CreateCaInput = {
  yaml: Scalars['String'];
};

export type CreateOrdererInput = {
  yaml: Scalars['String'];
};

export type CreatePeerInput = {
  yaml: Scalars['String'];
};

export type CryptoConfig = {
  __typename?: 'CryptoConfig';
  signatureHashFamily: Scalars['String'];
  identityIdentifierHashFunction: Scalars['String'];
};

export type LightChannel = {
  __typename?: 'LightChannel';
  name: Scalars['String'];
};

export type MspPrincipal = {
  __typename?: 'MSPPrincipal';
  combined?: Maybe<MspPrincipalCombined>;
  role?: Maybe<MspPrincipalRole>;
};

export type MspPrincipalCombined = {
  __typename?: 'MSPPrincipalCombined';
  classification: Scalars['String'];
  mspPrincipals?: Maybe<Array<MspPrincipal>>;
};

export type MspPrincipalRole = {
  __typename?: 'MSPPrincipalRole';
  mspID: Scalars['String'];
  role: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPeer?: Maybe<Peer>;
  updatePeer?: Maybe<Peer>;
  createOrderer?: Maybe<Orderer>;
  updateOrderer?: Maybe<Orderer>;
  createCA?: Maybe<Ca>;
  updateCA?: Maybe<Ca>;
};


export type MutationCreatePeerArgs = {
  input: CreatePeerInput;
};


export type MutationUpdatePeerArgs = {
  filter: NameAndNamespace;
  input: UpdateePeerInput;
};


export type MutationCreateOrdererArgs = {
  input: CreateOrdererInput;
};


export type MutationUpdateOrdererArgs = {
  filter: NameAndNamespace;
  input: UpdateeOrdererInput;
};


export type MutationCreateCaArgs = {
  input: CreateCaInput;
};


export type MutationUpdateCaArgs = {
  filter: NameAndNamespace;
  input: UpdateCaInput;
};

export type NameAndNamespace = {
  name: Scalars['String'];
  namespace: Scalars['String'];
};

export type Namespace = {
  __typename?: 'Namespace';
  name: Scalars['String'];
};

export type NetworkAddress = {
  __typename?: 'NetworkAddress';
  host: Scalars['String'];
  port: Scalars['Int'];
};

export type NodeOUs = {
  __typename?: 'NodeOUs';
  enable: Scalars['Boolean'];
  clientOUIdentifier: OuIdentifier;
  peerOUIdentifier: OuIdentifier;
  adminOUIdentifier: OuIdentifier;
  ordererOUIdentifier: OuIdentifier;
};

export type OuIdentifier = {
  __typename?: 'OUIdentifier';
  certificate: Scalars['String'];
  ouIdentifier: Scalars['String'];
};

export type Orderer = {
  __typename?: 'Orderer';
  name: Scalars['String'];
  namespace: Scalars['String'];
  yaml: Scalars['String'];
};

export type OrdererConfig = {
  __typename?: 'OrdererConfig';
  type: Scalars['String'];
  batchTimeout: Scalars['Int'];
  batchSize: OrdererConfigBatchSize;
  maxChannels: Scalars['Int'];
  capabilities?: Maybe<Array<Scalars['String']>>;
  state: Scalars['String'];
  policies?: Maybe<Array<ChannelPolicy>>;
  etcdDraft: OrdererConfigRaft;
  organizations?: Maybe<Array<ChannelOrg>>;
};

export type OrdererConfigBatchSize = {
  __typename?: 'OrdererConfigBatchSize';
  maxMessageCount: Scalars['Int'];
  absoluteMaxBytes: Scalars['Int'];
  preferredMaxBytes: Scalars['Int'];
};

export type OrdererConfigRaft = {
  __typename?: 'OrdererConfigRaft';
  consenters?: Maybe<Array<OrdererConfigRaftConsenter>>;
  options: OrdererConfigRaftOptions;
};

export type OrdererConfigRaftConsenter = {
  __typename?: 'OrdererConfigRaftConsenter';
  address: NetworkAddress;
  clientTlsCert: Scalars['String'];
  serverTlsCert: Scalars['String'];
};

export type OrdererConfigRaftOptions = {
  __typename?: 'OrdererConfigRaftOptions';
  tickInterval: Scalars['String'];
  electionTick: Scalars['Int'];
  heartbeatTick: Scalars['Int'];
  maxInflightBlocks: Scalars['Int'];
  snapshotIntervalSize: Scalars['Int'];
};

export type PdcRead = {
  __typename?: 'PDCRead';
  collectionName: Scalars['String'];
  key: Scalars['String'];
  block: Scalars['Int'];
  txNum: Scalars['Int'];
};

export type PdcWrite = {
  __typename?: 'PDCWrite';
  collectionName: Scalars['String'];
  deleted: Scalars['Boolean'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Peer = {
  __typename?: 'Peer';
  name: Scalars['String'];
  namespace: Scalars['String'];
  yaml: Scalars['String'];
};

export type PrivateDataCollection = {
  __typename?: 'PrivateDataCollection';
  name: Scalars['String'];
  requiredPeerCount: Scalars['Int'];
  maxPeerCount: Scalars['Int'];
  blockToLive: Scalars['Int'];
  memberOnlyRead: Scalars['Boolean'];
  memberOnlyWrite: Scalars['Boolean'];
  endorsementPolicy?: Maybe<ApplicationPolicy>;
  memberOrgsPolicy?: Maybe<SignaturePolicy>;
};

export type Query = {
  __typename?: 'Query';
  peers?: Maybe<Array<Peer>>;
  peer?: Maybe<Peer>;
  orderers?: Maybe<Array<Orderer>>;
  orderer?: Maybe<Orderer>;
  networkConfigEnabled: Scalars['Boolean'];
  cas?: Maybe<Array<Ca>>;
  ca?: Maybe<Ca>;
  namespaces?: Maybe<Array<Namespace>>;
  storageClasses?: Maybe<Array<StorageClass>>;
  channels?: Maybe<Array<LightChannel>>;
  channel: Channel;
  blocks: BlocksResponse;
  block: Block;
  blockWithPrivateData: BlockWithPrivateData;
  blockByTXID: Block;
};


export type QueryPeerArgs = {
  input: NameAndNamespace;
};


export type QueryOrdererArgs = {
  input: NameAndNamespace;
};


export type QueryCaArgs = {
  input: NameAndNamespace;
};


export type QueryChannelArgs = {
  channelID: Scalars['String'];
};


export type QueryBlocksArgs = {
  channelID: Scalars['String'];
  from: Scalars['Int'];
  to: Scalars['Int'];
  reverse: Scalars['Boolean'];
};


export type QueryBlockArgs = {
  channelID: Scalars['String'];
  blockNumber: Scalars['Int'];
};


export type QueryBlockWithPrivateDataArgs = {
  channelID: Scalars['String'];
  blockNumber: Scalars['Int'];
};


export type QueryBlockByTxidArgs = {
  channelID: Scalars['String'];
  transactionID: Scalars['String'];
};

export type SignaturePolicy = {
  __typename?: 'SignaturePolicy';
  version: Scalars['Int'];
  rule: SignaturePolicyRule;
  principals?: Maybe<Array<MspPrincipal>>;
};

export type SignaturePolicyNOutOf = {
  __typename?: 'SignaturePolicyNOutOf';
  n: Scalars['Int'];
  rules?: Maybe<Array<SignaturePolicyRule>>;
};

export type SignaturePolicyRule = {
  __typename?: 'SignaturePolicyRule';
  type: Scalars['String'];
  noutOf?: Maybe<SignaturePolicyNOutOf>;
  signedBy?: Maybe<SignaturePolicySignedBy>;
};

export type SignaturePolicySignedBy = {
  __typename?: 'SignaturePolicySignedBy';
  signedBy: Scalars['Int'];
};

export type StorageClass = {
  __typename?: 'StorageClass';
  name: Scalars['String'];
};


export type Transaction = {
  __typename?: 'Transaction';
  txID: Scalars['String'];
  type: TransactionType;
  createdAt: Scalars['Time'];
  version: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  response?: Maybe<Scalars['String']>;
  request?: Maybe<Scalars['String']>;
  chaincode: Scalars['String'];
  writes?: Maybe<Array<TransactionWrite>>;
  reads?: Maybe<Array<TransactionRead>>;
};

export type TransactionRead = {
  __typename?: 'TransactionRead';
  chaincodeID: Scalars['String'];
  key: Scalars['String'];
  blockNumVersion?: Maybe<Scalars['Int']>;
  txNumVersion?: Maybe<Scalars['Int']>;
};

export enum TransactionType {
  Message = 'MESSAGE',
  Config = 'CONFIG',
  ConfigUpdate = 'CONFIG_UPDATE',
  EndorserTransaction = 'ENDORSER_TRANSACTION',
  OrdererTransaction = 'ORDERER_TRANSACTION',
  DeliverSeekInfo = 'DELIVER_SEEK_INFO',
  ChaincodePackage = 'CHAINCODE_PACKAGE'
}

export type TransactionWithPrivateData = {
  __typename?: 'TransactionWithPrivateData';
  txID: Scalars['String'];
  type: TransactionType;
  createdAt: Scalars['Time'];
  version: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  response?: Maybe<Scalars['String']>;
  request?: Maybe<Scalars['String']>;
  chaincode: Scalars['String'];
  writes?: Maybe<Array<TransactionWrite>>;
  reads?: Maybe<Array<TransactionRead>>;
  pdcWrites?: Maybe<Array<PdcWrite>>;
  pdcReads?: Maybe<Array<PdcRead>>;
};

export type TransactionWrite = {
  __typename?: 'TransactionWrite';
  chaincodeID: Scalars['String'];
  deleted: Scalars['Boolean'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type UpdateCaInput = {
  yaml: Scalars['String'];
};

export type UpdateeOrdererInput = {
  yaml: Scalars['String'];
};

export type UpdateePeerInput = {
  yaml: Scalars['String'];
};

export type GetBlockQueryVariables = Exact<{
  channelID: Scalars['String'];
  blockNumber: Scalars['Int'];
}>;


export type GetBlockQuery = (
  { __typename?: 'Query' }
  & { block: (
    { __typename?: 'Block' }
    & Pick<Block, 'blockNumber' | 'createdAt' | 'dataHash' | 'numTransactions'>
    & { transactions?: Maybe<Array<(
      { __typename?: 'Transaction' }
      & Pick<Transaction, 'chaincode' | 'path' | 'createdAt' | 'txID' | 'type' | 'version'>
      & { reads?: Maybe<Array<(
        { __typename?: 'TransactionRead' }
        & Pick<TransactionRead, 'blockNumVersion' | 'chaincodeID' | 'key' | 'txNumVersion'>
      )>>, writes?: Maybe<Array<(
        { __typename?: 'TransactionWrite' }
        & Pick<TransactionWrite, 'chaincodeID' | 'deleted' | 'key' | 'value'>
      )>> }
    )>> }
  ) }
);

export type GetBlockWithPrivateDataQueryVariables = Exact<{
  channelID: Scalars['String'];
  blockNumber: Scalars['Int'];
}>;


export type GetBlockWithPrivateDataQuery = (
  { __typename?: 'Query' }
  & { block: (
    { __typename?: 'BlockWithPrivateData' }
    & Pick<BlockWithPrivateData, 'blockNumber' | 'createdAt' | 'dataHash' | 'numTransactions'>
    & { transactions?: Maybe<Array<(
      { __typename?: 'TransactionWithPrivateData' }
      & Pick<TransactionWithPrivateData, 'chaincode' | 'path' | 'createdAt' | 'txID' | 'type' | 'version'>
      & { reads?: Maybe<Array<(
        { __typename?: 'TransactionRead' }
        & Pick<TransactionRead, 'blockNumVersion' | 'chaincodeID' | 'key' | 'txNumVersion'>
      )>>, writes?: Maybe<Array<(
        { __typename?: 'TransactionWrite' }
        & Pick<TransactionWrite, 'chaincodeID' | 'deleted' | 'key' | 'value'>
      )>>, pdcWrites?: Maybe<Array<(
        { __typename?: 'PDCWrite' }
        & Pick<PdcWrite, 'collectionName' | 'deleted' | 'key' | 'value'>
      )>>, pdcReads?: Maybe<Array<(
        { __typename?: 'PDCRead' }
        & Pick<PdcRead, 'collectionName' | 'key' | 'block' | 'txNum'>
      )>> }
    )>> }
  ) }
);

export type GetBlocksQueryVariables = Exact<{
  channelID: Scalars['String'];
  from: Scalars['Int'];
  to: Scalars['Int'];
  reverse?: Maybe<Scalars['Boolean']>;
}>;


export type GetBlocksQuery = (
  { __typename?: 'Query' }
  & { blocks: (
    { __typename?: 'BlocksResponse' }
    & Pick<BlocksResponse, 'height'>
    & { blocks?: Maybe<Array<(
      { __typename?: 'Block' }
      & Pick<Block, 'blockNumber' | 'createdAt' | 'dataHash' | 'numTransactions'>
      & { transactions?: Maybe<Array<(
        { __typename?: 'Transaction' }
        & Pick<Transaction, 'chaincode' | 'path' | 'createdAt' | 'txID' | 'type' | 'version'>
        & { reads?: Maybe<Array<(
          { __typename?: 'TransactionRead' }
          & Pick<TransactionRead, 'blockNumVersion' | 'chaincodeID' | 'key' | 'txNumVersion'>
        )>>, writes?: Maybe<Array<(
          { __typename?: 'TransactionWrite' }
          & Pick<TransactionWrite, 'chaincodeID' | 'deleted' | 'key' | 'value'>
        )>> }
      )>> }
    )>> }
  ) }
);

export type GetCaQueryVariables = Exact<{
  input: NameAndNamespace;
}>;


export type GetCaQuery = (
  { __typename?: 'Query' }
  & { ca?: Maybe<(
    { __typename?: 'CA' }
    & Pick<Ca, 'name' | 'namespace' | 'yaml'>
  )> }
);

export type GetCAsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCAsQuery = (
  { __typename?: 'Query' }
  & { cas?: Maybe<Array<(
    { __typename?: 'CA' }
    & Pick<Ca, 'name' | 'namespace' | 'yaml'>
  )>> }
);

export type ChannelQueryVariables = Exact<{
  channelID: Scalars['String'];
}>;


export type ChannelQuery = (
  { __typename?: 'Query' }
  & { channel: (
    { __typename?: 'Channel' }
    & Pick<Channel, 'name' | 'height'>
    & { peers?: Maybe<Array<(
      { __typename?: 'ChannelPeer' }
      & Pick<ChannelPeer, 'mspID' | 'url' | 'height'>
    )>>, orderer: (
      { __typename?: 'OrdererConfig' }
      & Pick<OrdererConfig, 'type' | 'batchTimeout' | 'maxChannels' | 'capabilities' | 'state'>
      & { batchSize: (
        { __typename?: 'OrdererConfigBatchSize' }
        & Pick<OrdererConfigBatchSize, 'maxMessageCount' | 'absoluteMaxBytes' | 'preferredMaxBytes'>
      ), policies?: Maybe<Array<(
        { __typename?: 'ChannelPolicy' }
        & Pick<ChannelPolicy, 'key' | 'type' | 'rule' | 'modPolicy'>
      )>>, etcdDraft: (
        { __typename?: 'OrdererConfigRaft' }
        & { consenters?: Maybe<Array<(
          { __typename?: 'OrdererConfigRaftConsenter' }
          & Pick<OrdererConfigRaftConsenter, 'clientTlsCert' | 'serverTlsCert'>
          & { address: (
            { __typename?: 'NetworkAddress' }
            & Pick<NetworkAddress, 'host' | 'port'>
          ) }
        )>> }
      ), organizations?: Maybe<Array<(
        { __typename?: 'ChannelOrg' }
        & Pick<ChannelOrg, 'modPolicy' | 'mspID' | 'ordererEndpoints'>
        & { cryptoConfig: (
          { __typename?: 'CryptoConfig' }
          & Pick<CryptoConfig, 'signatureHashFamily' | 'identityIdentifierHashFunction'>
        ), msp: (
          { __typename?: 'ChannelMSP' }
          & Pick<ChannelMsp, 'name' | 'rootCerts' | 'intermediateCerts' | 'admins' | 'revocationList' | 'tlsRootCerts' | 'tlsIntermediateCerts'>
        ), nodeOUs: (
          { __typename?: 'NodeOUs' }
          & Pick<NodeOUs, 'enable'>
          & { clientOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ), peerOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ), adminOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ), ordererOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ) }
        ), policies?: Maybe<Array<(
          { __typename?: 'ChannelPolicy' }
          & Pick<ChannelPolicy, 'key' | 'type' | 'rule' | 'modPolicy'>
        )>>, ous?: Maybe<Array<(
          { __typename?: 'OUIdentifier' }
          & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
        )>> }
      )>> }
    ), application?: Maybe<(
      { __typename?: 'ApplicationConfig' }
      & Pick<ApplicationConfig, 'capabilities'>
      & { policies?: Maybe<Array<(
        { __typename?: 'ChannelPolicy' }
        & Pick<ChannelPolicy, 'key' | 'type' | 'rule' | 'modPolicy'>
      )>>, acls?: Maybe<Array<(
        { __typename?: 'ChannelACL' }
        & Pick<ChannelAcl, 'key' | 'value'>
      )>>, organizations?: Maybe<Array<(
        { __typename?: 'ChannelOrg' }
        & Pick<ChannelOrg, 'mspID' | 'modPolicy' | 'ordererEndpoints'>
        & { anchorPeer?: Maybe<Array<(
          { __typename?: 'NetworkAddress' }
          & Pick<NetworkAddress, 'host' | 'port'>
        )>>, cryptoConfig: (
          { __typename?: 'CryptoConfig' }
          & Pick<CryptoConfig, 'signatureHashFamily' | 'identityIdentifierHashFunction'>
        ), msp: (
          { __typename?: 'ChannelMSP' }
          & Pick<ChannelMsp, 'name' | 'rootCerts' | 'intermediateCerts' | 'admins' | 'revocationList' | 'tlsRootCerts' | 'tlsIntermediateCerts'>
        ), ous?: Maybe<Array<(
          { __typename?: 'OUIdentifier' }
          & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
        )>>, nodeOUs: (
          { __typename?: 'NodeOUs' }
          & Pick<NodeOUs, 'enable'>
          & { clientOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ), ordererOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ), peerOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ), adminOUIdentifier: (
            { __typename?: 'OUIdentifier' }
            & Pick<OuIdentifier, 'certificate' | 'ouIdentifier'>
          ) }
        ) }
      )>> }
    )> }
  ) }
);

export type ChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type ChannelsQuery = (
  { __typename?: 'Query' }
  & { channels?: Maybe<Array<(
    { __typename?: 'LightChannel' }
    & Pick<LightChannel, 'name'>
  )>> }
);

export type GetNamespacesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNamespacesQuery = (
  { __typename?: 'Query' }
  & { namespaces?: Maybe<Array<(
    { __typename?: 'Namespace' }
    & Pick<Namespace, 'name'>
  )>> }
);

export type GetOrdererQueryVariables = Exact<{
  input: NameAndNamespace;
}>;


export type GetOrdererQuery = (
  { __typename?: 'Query' }
  & { orderer?: Maybe<(
    { __typename?: 'Orderer' }
    & Pick<Orderer, 'name' | 'namespace' | 'yaml'>
  )> }
);

export type GetOrderersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrderersQuery = (
  { __typename?: 'Query' }
  & { orderers?: Maybe<Array<(
    { __typename?: 'Orderer' }
    & Pick<Orderer, 'name' | 'namespace' | 'yaml'>
  )>> }
);

export type GetPeerQueryVariables = Exact<{
  input: NameAndNamespace;
}>;


export type GetPeerQuery = (
  { __typename?: 'Query' }
  & { peer?: Maybe<(
    { __typename?: 'Peer' }
    & Pick<Peer, 'name' | 'namespace' | 'yaml'>
  )> }
);

export type GetPeersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPeersQuery = (
  { __typename?: 'Query' }
  & { peers?: Maybe<Array<(
    { __typename?: 'Peer' }
    & Pick<Peer, 'name' | 'namespace' | 'yaml'>
  )>> }
);

export type GetStorageClassesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStorageClassesQuery = (
  { __typename?: 'Query' }
  & { storageClasses?: Maybe<Array<(
    { __typename?: 'StorageClass' }
    & Pick<StorageClass, 'name'>
  )>> }
);

export type GetBlockByTxidQueryVariables = Exact<{
  channelID: Scalars['String'];
  txID: Scalars['String'];
}>;


export type GetBlockByTxidQuery = (
  { __typename?: 'Query' }
  & { block: (
    { __typename?: 'Block' }
    & Pick<Block, 'blockNumber' | 'createdAt' | 'dataHash' | 'numTransactions'>
    & { transactions?: Maybe<Array<(
      { __typename?: 'Transaction' }
      & Pick<Transaction, 'chaincode' | 'path' | 'createdAt' | 'txID' | 'type' | 'version'>
      & { reads?: Maybe<Array<(
        { __typename?: 'TransactionRead' }
        & Pick<TransactionRead, 'blockNumVersion' | 'chaincodeID' | 'key' | 'txNumVersion'>
      )>>, writes?: Maybe<Array<(
        { __typename?: 'TransactionWrite' }
        & Pick<TransactionWrite, 'chaincodeID' | 'deleted' | 'key' | 'value'>
      )>> }
    )>> }
  ) }
);

export type NetworkConfigEnabledQueryVariables = Exact<{ [key: string]: never; }>;


export type NetworkConfigEnabledQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'networkConfigEnabled'>
);


export const GetBlockDocument = gql`
    query GetBlock($channelID: String!, $blockNumber: Int!) {
  block(channelID: $channelID, blockNumber: $blockNumber) {
    blockNumber
    createdAt
    dataHash
    numTransactions
    transactions {
      chaincode
      path
      createdAt
      path
      reads {
        blockNumVersion
        chaincodeID
        key
        txNumVersion
      }
      writes {
        chaincodeID
        deleted
        key
        value
      }
      txID
      type
      version
    }
  }
}
    `;

/**
 * __useGetBlockQuery__
 *
 * To run a query within a React component, call `useGetBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlockQuery({
 *   variables: {
 *      channelID: // value for 'channelID'
 *      blockNumber: // value for 'blockNumber'
 *   },
 * });
 */
export function useGetBlockQuery(baseOptions: Apollo.QueryHookOptions<GetBlockQuery, GetBlockQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlockQuery, GetBlockQueryVariables>(GetBlockDocument, options);
      }
export function useGetBlockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlockQuery, GetBlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlockQuery, GetBlockQueryVariables>(GetBlockDocument, options);
        }
export type GetBlockQueryHookResult = ReturnType<typeof useGetBlockQuery>;
export type GetBlockLazyQueryHookResult = ReturnType<typeof useGetBlockLazyQuery>;
export type GetBlockQueryResult = Apollo.QueryResult<GetBlockQuery, GetBlockQueryVariables>;
export const GetBlockWithPrivateDataDocument = gql`
    query GetBlockWithPrivateData($channelID: String!, $blockNumber: Int!) {
  block: blockWithPrivateData(channelID: $channelID, blockNumber: $blockNumber) {
    blockNumber
    createdAt
    dataHash
    numTransactions
    transactions {
      chaincode
      path
      createdAt
      path
      reads {
        blockNumVersion
        chaincodeID
        key
        txNumVersion
      }
      writes {
        chaincodeID
        deleted
        key
        value
      }
      pdcWrites {
        collectionName
        deleted
        key
        value
      }
      pdcReads {
        collectionName
        key
        block
        txNum
      }
      txID
      type
      version
    }
  }
}
    `;

/**
 * __useGetBlockWithPrivateDataQuery__
 *
 * To run a query within a React component, call `useGetBlockWithPrivateDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockWithPrivateDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlockWithPrivateDataQuery({
 *   variables: {
 *      channelID: // value for 'channelID'
 *      blockNumber: // value for 'blockNumber'
 *   },
 * });
 */
export function useGetBlockWithPrivateDataQuery(baseOptions: Apollo.QueryHookOptions<GetBlockWithPrivateDataQuery, GetBlockWithPrivateDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlockWithPrivateDataQuery, GetBlockWithPrivateDataQueryVariables>(GetBlockWithPrivateDataDocument, options);
      }
export function useGetBlockWithPrivateDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlockWithPrivateDataQuery, GetBlockWithPrivateDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlockWithPrivateDataQuery, GetBlockWithPrivateDataQueryVariables>(GetBlockWithPrivateDataDocument, options);
        }
export type GetBlockWithPrivateDataQueryHookResult = ReturnType<typeof useGetBlockWithPrivateDataQuery>;
export type GetBlockWithPrivateDataLazyQueryHookResult = ReturnType<typeof useGetBlockWithPrivateDataLazyQuery>;
export type GetBlockWithPrivateDataQueryResult = Apollo.QueryResult<GetBlockWithPrivateDataQuery, GetBlockWithPrivateDataQueryVariables>;
export const GetBlocksDocument = gql`
    query GetBlocks($channelID: String!, $from: Int!, $to: Int!, $reverse: Boolean = true) {
  blocks(channelID: $channelID, from: $from, to: $to, reverse: $reverse) {
    height
    blocks {
      blockNumber
      createdAt
      dataHash
      numTransactions
      transactions {
        chaincode
        path
        createdAt
        path
        reads {
          blockNumVersion
          chaincodeID
          key
          txNumVersion
        }
        writes {
          chaincodeID
          deleted
          key
          value
        }
        txID
        type
        version
      }
    }
  }
}
    `;

/**
 * __useGetBlocksQuery__
 *
 * To run a query within a React component, call `useGetBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlocksQuery({
 *   variables: {
 *      channelID: // value for 'channelID'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      reverse: // value for 'reverse'
 *   },
 * });
 */
export function useGetBlocksQuery(baseOptions: Apollo.QueryHookOptions<GetBlocksQuery, GetBlocksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlocksQuery, GetBlocksQueryVariables>(GetBlocksDocument, options);
      }
export function useGetBlocksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlocksQuery, GetBlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlocksQuery, GetBlocksQueryVariables>(GetBlocksDocument, options);
        }
export type GetBlocksQueryHookResult = ReturnType<typeof useGetBlocksQuery>;
export type GetBlocksLazyQueryHookResult = ReturnType<typeof useGetBlocksLazyQuery>;
export type GetBlocksQueryResult = Apollo.QueryResult<GetBlocksQuery, GetBlocksQueryVariables>;
export const GetCaDocument = gql`
    query GetCA($input: NameAndNamespace!) {
  ca(input: $input) {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetCaQuery__
 *
 * To run a query within a React component, call `useGetCaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCaQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCaQuery(baseOptions: Apollo.QueryHookOptions<GetCaQuery, GetCaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCaQuery, GetCaQueryVariables>(GetCaDocument, options);
      }
export function useGetCaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCaQuery, GetCaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCaQuery, GetCaQueryVariables>(GetCaDocument, options);
        }
export type GetCaQueryHookResult = ReturnType<typeof useGetCaQuery>;
export type GetCaLazyQueryHookResult = ReturnType<typeof useGetCaLazyQuery>;
export type GetCaQueryResult = Apollo.QueryResult<GetCaQuery, GetCaQueryVariables>;
export const GetCAsDocument = gql`
    query GetCAs {
  cas {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetCAsQuery__
 *
 * To run a query within a React component, call `useGetCAsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCAsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCAsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCAsQuery(baseOptions?: Apollo.QueryHookOptions<GetCAsQuery, GetCAsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCAsQuery, GetCAsQueryVariables>(GetCAsDocument, options);
      }
export function useGetCAsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCAsQuery, GetCAsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCAsQuery, GetCAsQueryVariables>(GetCAsDocument, options);
        }
export type GetCAsQueryHookResult = ReturnType<typeof useGetCAsQuery>;
export type GetCAsLazyQueryHookResult = ReturnType<typeof useGetCAsLazyQuery>;
export type GetCAsQueryResult = Apollo.QueryResult<GetCAsQuery, GetCAsQueryVariables>;
export const ChannelDocument = gql`
    query channel($channelID: String!) {
  channel(channelID: $channelID) {
    name
    peers {
      mspID
      url
      height
    }
    height
    orderer {
      type
      batchTimeout
      batchSize {
        maxMessageCount
        absoluteMaxBytes
        preferredMaxBytes
      }
      maxChannels
      capabilities
      state
      policies {
        key
        type
        rule
        modPolicy
      }
      etcdDraft {
        consenters {
          address {
            host
            port
          }
          clientTlsCert
          serverTlsCert
        }
      }
      organizations {
        modPolicy
        mspID
        ordererEndpoints
        cryptoConfig {
          signatureHashFamily
          identityIdentifierHashFunction
        }
        msp {
          name
          rootCerts
          intermediateCerts
          admins
          revocationList
          revocationList
          tlsRootCerts
          tlsIntermediateCerts
        }
        nodeOUs {
          enable
          clientOUIdentifier {
            certificate
            ouIdentifier
          }
          peerOUIdentifier {
            certificate
            ouIdentifier
          }
          adminOUIdentifier {
            certificate
            ouIdentifier
          }
          ordererOUIdentifier {
            certificate
            ouIdentifier
          }
        }
        policies {
          key
          type
          rule
          modPolicy
        }
        ous {
          certificate
          ouIdentifier
        }
      }
    }
    application {
      policies {
        key
        type
        rule
        modPolicy
      }
      capabilities
      acls {
        key
        value
      }
      organizations {
        mspID
        modPolicy
        anchorPeer {
          host
          port
        }
        ordererEndpoints
        cryptoConfig {
          signatureHashFamily
          identityIdentifierHashFunction
        }
        msp {
          name
          rootCerts
          intermediateCerts
          admins
          revocationList
          revocationList
          tlsRootCerts
          tlsIntermediateCerts
        }
        ous {
          certificate
          ouIdentifier
        }
        nodeOUs {
          enable
          clientOUIdentifier {
            certificate
            ouIdentifier
          }
          ordererOUIdentifier {
            certificate
            ouIdentifier
          }
          peerOUIdentifier {
            certificate
            ouIdentifier
          }
          adminOUIdentifier {
            certificate
            ouIdentifier
          }
        }
      }
    }
  }
}
    `;

/**
 * __useChannelQuery__
 *
 * To run a query within a React component, call `useChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelQuery({
 *   variables: {
 *      channelID: // value for 'channelID'
 *   },
 * });
 */
export function useChannelQuery(baseOptions: Apollo.QueryHookOptions<ChannelQuery, ChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelQuery, ChannelQueryVariables>(ChannelDocument, options);
      }
export function useChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelQuery, ChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelQuery, ChannelQueryVariables>(ChannelDocument, options);
        }
export type ChannelQueryHookResult = ReturnType<typeof useChannelQuery>;
export type ChannelLazyQueryHookResult = ReturnType<typeof useChannelLazyQuery>;
export type ChannelQueryResult = Apollo.QueryResult<ChannelQuery, ChannelQueryVariables>;
export const ChannelsDocument = gql`
    query channels {
  channels {
    name
  }
}
    `;

/**
 * __useChannelsQuery__
 *
 * To run a query within a React component, call `useChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useChannelsQuery(baseOptions?: Apollo.QueryHookOptions<ChannelsQuery, ChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, options);
      }
export function useChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelsQuery, ChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, options);
        }
export type ChannelsQueryHookResult = ReturnType<typeof useChannelsQuery>;
export type ChannelsLazyQueryHookResult = ReturnType<typeof useChannelsLazyQuery>;
export type ChannelsQueryResult = Apollo.QueryResult<ChannelsQuery, ChannelsQueryVariables>;
export const GetNamespacesDocument = gql`
    query GetNamespaces {
  namespaces {
    name
  }
}
    `;

/**
 * __useGetNamespacesQuery__
 *
 * To run a query within a React component, call `useGetNamespacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNamespacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNamespacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNamespacesQuery(baseOptions?: Apollo.QueryHookOptions<GetNamespacesQuery, GetNamespacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNamespacesQuery, GetNamespacesQueryVariables>(GetNamespacesDocument, options);
      }
export function useGetNamespacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNamespacesQuery, GetNamespacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNamespacesQuery, GetNamespacesQueryVariables>(GetNamespacesDocument, options);
        }
export type GetNamespacesQueryHookResult = ReturnType<typeof useGetNamespacesQuery>;
export type GetNamespacesLazyQueryHookResult = ReturnType<typeof useGetNamespacesLazyQuery>;
export type GetNamespacesQueryResult = Apollo.QueryResult<GetNamespacesQuery, GetNamespacesQueryVariables>;
export const GetOrdererDocument = gql`
    query GetOrderer($input: NameAndNamespace!) {
  orderer(input: $input) {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetOrdererQuery__
 *
 * To run a query within a React component, call `useGetOrdererQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdererQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdererQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetOrdererQuery(baseOptions: Apollo.QueryHookOptions<GetOrdererQuery, GetOrdererQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrdererQuery, GetOrdererQueryVariables>(GetOrdererDocument, options);
      }
export function useGetOrdererLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrdererQuery, GetOrdererQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrdererQuery, GetOrdererQueryVariables>(GetOrdererDocument, options);
        }
export type GetOrdererQueryHookResult = ReturnType<typeof useGetOrdererQuery>;
export type GetOrdererLazyQueryHookResult = ReturnType<typeof useGetOrdererLazyQuery>;
export type GetOrdererQueryResult = Apollo.QueryResult<GetOrdererQuery, GetOrdererQueryVariables>;
export const GetOrderersDocument = gql`
    query GetOrderers {
  orderers {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetOrderersQuery__
 *
 * To run a query within a React component, call `useGetOrderersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOrderersQuery(baseOptions?: Apollo.QueryHookOptions<GetOrderersQuery, GetOrderersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrderersQuery, GetOrderersQueryVariables>(GetOrderersDocument, options);
      }
export function useGetOrderersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrderersQuery, GetOrderersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrderersQuery, GetOrderersQueryVariables>(GetOrderersDocument, options);
        }
export type GetOrderersQueryHookResult = ReturnType<typeof useGetOrderersQuery>;
export type GetOrderersLazyQueryHookResult = ReturnType<typeof useGetOrderersLazyQuery>;
export type GetOrderersQueryResult = Apollo.QueryResult<GetOrderersQuery, GetOrderersQueryVariables>;
export const GetPeerDocument = gql`
    query GetPeer($input: NameAndNamespace!) {
  peer(input: $input) {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetPeerQuery__
 *
 * To run a query within a React component, call `useGetPeerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeerQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetPeerQuery(baseOptions: Apollo.QueryHookOptions<GetPeerQuery, GetPeerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPeerQuery, GetPeerQueryVariables>(GetPeerDocument, options);
      }
export function useGetPeerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPeerQuery, GetPeerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPeerQuery, GetPeerQueryVariables>(GetPeerDocument, options);
        }
export type GetPeerQueryHookResult = ReturnType<typeof useGetPeerQuery>;
export type GetPeerLazyQueryHookResult = ReturnType<typeof useGetPeerLazyQuery>;
export type GetPeerQueryResult = Apollo.QueryResult<GetPeerQuery, GetPeerQueryVariables>;
export const GetPeersDocument = gql`
    query GetPeers {
  peers {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetPeersQuery__
 *
 * To run a query within a React component, call `useGetPeersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPeersQuery(baseOptions?: Apollo.QueryHookOptions<GetPeersQuery, GetPeersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPeersQuery, GetPeersQueryVariables>(GetPeersDocument, options);
      }
export function useGetPeersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPeersQuery, GetPeersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPeersQuery, GetPeersQueryVariables>(GetPeersDocument, options);
        }
export type GetPeersQueryHookResult = ReturnType<typeof useGetPeersQuery>;
export type GetPeersLazyQueryHookResult = ReturnType<typeof useGetPeersLazyQuery>;
export type GetPeersQueryResult = Apollo.QueryResult<GetPeersQuery, GetPeersQueryVariables>;
export const GetStorageClassesDocument = gql`
    query GetStorageClasses {
  storageClasses {
    name
  }
}
    `;

/**
 * __useGetStorageClassesQuery__
 *
 * To run a query within a React component, call `useGetStorageClassesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStorageClassesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStorageClassesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStorageClassesQuery(baseOptions?: Apollo.QueryHookOptions<GetStorageClassesQuery, GetStorageClassesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStorageClassesQuery, GetStorageClassesQueryVariables>(GetStorageClassesDocument, options);
      }
export function useGetStorageClassesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStorageClassesQuery, GetStorageClassesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStorageClassesQuery, GetStorageClassesQueryVariables>(GetStorageClassesDocument, options);
        }
export type GetStorageClassesQueryHookResult = ReturnType<typeof useGetStorageClassesQuery>;
export type GetStorageClassesLazyQueryHookResult = ReturnType<typeof useGetStorageClassesLazyQuery>;
export type GetStorageClassesQueryResult = Apollo.QueryResult<GetStorageClassesQuery, GetStorageClassesQueryVariables>;
export const GetBlockByTxidDocument = gql`
    query GetBlockByTXID($channelID: String!, $txID: String!) {
  block: blockByTXID(channelID: $channelID, transactionID: $txID) {
    blockNumber
    createdAt
    dataHash
    numTransactions
    transactions {
      chaincode
      path
      createdAt
      path
      reads {
        blockNumVersion
        chaincodeID
        key
        txNumVersion
      }
      writes {
        chaincodeID
        deleted
        key
        value
      }
      txID
      type
      version
    }
  }
}
    `;

/**
 * __useGetBlockByTxidQuery__
 *
 * To run a query within a React component, call `useGetBlockByTxidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockByTxidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlockByTxidQuery({
 *   variables: {
 *      channelID: // value for 'channelID'
 *      txID: // value for 'txID'
 *   },
 * });
 */
export function useGetBlockByTxidQuery(baseOptions: Apollo.QueryHookOptions<GetBlockByTxidQuery, GetBlockByTxidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlockByTxidQuery, GetBlockByTxidQueryVariables>(GetBlockByTxidDocument, options);
      }
export function useGetBlockByTxidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlockByTxidQuery, GetBlockByTxidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlockByTxidQuery, GetBlockByTxidQueryVariables>(GetBlockByTxidDocument, options);
        }
export type GetBlockByTxidQueryHookResult = ReturnType<typeof useGetBlockByTxidQuery>;
export type GetBlockByTxidLazyQueryHookResult = ReturnType<typeof useGetBlockByTxidLazyQuery>;
export type GetBlockByTxidQueryResult = Apollo.QueryResult<GetBlockByTxidQuery, GetBlockByTxidQueryVariables>;
export const NetworkConfigEnabledDocument = gql`
    query networkConfigEnabled {
  networkConfigEnabled
}
    `;

/**
 * __useNetworkConfigEnabledQuery__
 *
 * To run a query within a React component, call `useNetworkConfigEnabledQuery` and pass it any options that fit your needs.
 * When your component renders, `useNetworkConfigEnabledQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworkConfigEnabledQuery({
 *   variables: {
 *   },
 * });
 */
export function useNetworkConfigEnabledQuery(baseOptions?: Apollo.QueryHookOptions<NetworkConfigEnabledQuery, NetworkConfigEnabledQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NetworkConfigEnabledQuery, NetworkConfigEnabledQueryVariables>(NetworkConfigEnabledDocument, options);
      }
export function useNetworkConfigEnabledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworkConfigEnabledQuery, NetworkConfigEnabledQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NetworkConfigEnabledQuery, NetworkConfigEnabledQueryVariables>(NetworkConfigEnabledDocument, options);
        }
export type NetworkConfigEnabledQueryHookResult = ReturnType<typeof useNetworkConfigEnabledQuery>;
export type NetworkConfigEnabledLazyQueryHookResult = ReturnType<typeof useNetworkConfigEnabledLazyQuery>;
export type NetworkConfigEnabledQueryResult = Apollo.QueryResult<NetworkConfigEnabledQuery, NetworkConfigEnabledQueryVariables>;