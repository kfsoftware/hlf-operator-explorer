package resolvers

// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

import (
	"context"

	"github.com/kfsoftware/hlf-operator-ui/api/gql"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/models"
)

type Resolver struct{}

func (r *mutationResolver) CreatePeer(ctx context.Context, input models.CreatePeerInput) (*models.Peer, error) {
	panic("not implemented")
}

func (r *mutationResolver) UpdatePeer(ctx context.Context, filter models.NameAndNamespace, input models.UpdateePeerInput) (*models.Peer, error) {
	panic("not implemented")
}

func (r *mutationResolver) CreateOrderer(ctx context.Context, input models.CreateOrdererInput) (*models.Orderer, error) {
	panic("not implemented")
}

func (r *mutationResolver) UpdateOrderer(ctx context.Context, filter models.NameAndNamespace, input models.UpdateeOrdererInput) (*models.Orderer, error) {
	panic("not implemented")
}

func (r *mutationResolver) CreateCa(ctx context.Context, input models.CreateCAInput) (*models.Ca, error) {
	panic("not implemented")
}

func (r *mutationResolver) UpdateCa(ctx context.Context, filter models.NameAndNamespace, input models.UpdateeCAInput) (*models.Ca, error) {
	panic("not implemented")
}

func (r *queryResolver) Peers(ctx context.Context) ([]*models.Peer, error) {
	panic("not implemented")
}

func (r *queryResolver) Peer(ctx context.Context, input models.NameAndNamespace) (*models.Peer, error) {
	panic("not implemented")
}

func (r *queryResolver) Orderers(ctx context.Context) ([]*models.Orderer, error) {
	panic("not implemented")
}

func (r *queryResolver) Orderer(ctx context.Context, input models.NameAndNamespace) (*models.Orderer, error) {
	panic("not implemented")
}

func (r *queryResolver) Cas(ctx context.Context) ([]*models.Ca, error) {
	panic("not implemented")
}

func (r *queryResolver) Ca(ctx context.Context, input models.NameAndNamespace) (*models.Ca, error) {
	panic("not implemented")
}

// Mutation returns gql.MutationResolver implementation.
func (r *Resolver) Mutation() gql.MutationResolver { return &mutationResolver{r} }

// Query returns gql.QueryResolver implementation.
func (r *Resolver) Query() gql.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
