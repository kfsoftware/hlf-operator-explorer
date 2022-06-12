package resolvers

import (
	"context"

	"github.com/kfsoftware/hlf-operator-ui/api/gql/models"
	"github.com/kfsoftware/hlf-operator/api/hlf.kungfusoftware.es/v1alpha1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
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
	fabricCA, err := r.HLFClient.HlfV1alpha1().FabricCAs("default").Create(ctx, &v1alpha1.FabricCA{}, v1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	return &models.Ca{
		Name: fabricCA.Name,
	}, nil
}

func (r *mutationResolver) UpdateCa(ctx context.Context, filter models.NameAndNamespace, input models.UpdateeCAInput) (*models.Ca, error) {
	panic("not implemented")
}
