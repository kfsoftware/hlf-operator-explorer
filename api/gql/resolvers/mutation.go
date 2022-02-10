package resolvers

import (
	"context"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/models"
)

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
