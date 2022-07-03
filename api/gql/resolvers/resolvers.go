package resolvers

// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

import (
	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/core"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	"github.com/kfsoftware/hlf-operator-ui/api/gql"
	operatorv1 "github.com/kfsoftware/hlf-operator/pkg/client/clientset/versioned"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

type Resolver struct {
	MSPID          string
	User           string
	KubeClient     kubernetes.Interface
	Config         *rest.Config
	HLFClient      operatorv1.Interface
	FabricSDK      *fabsdk.FabricSDK
	ConfigBackends []core.ConfigBackend
	Gateway        *client.Gateway
}

// Mutation returns gql.MutationResolver implementation.
func (r *Resolver) Mutation() gql.MutationResolver { return &mutationResolver{r} }

// Query returns gql.QueryResolver implementation.
func (r *Resolver) Query() gql.QueryResolver     { return &queryResolver{r} }
func (r *Resolver) Channel() gql.ChannelResolver { return &channelResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

type channelResolver struct{ *Resolver }
