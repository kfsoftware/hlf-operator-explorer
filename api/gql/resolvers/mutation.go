package resolvers

import (
	"context"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/models"
	"github.com/kfsoftware/hlf-operator/api/hlf.kungfusoftware.es/v1alpha1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/yaml"
	"time"
)

func (r *mutationResolver) CreatePeer(ctx context.Context, input models.CreatePeerInput) (*models.Peer, error) {
	fabricPeer := v1alpha1.FabricPeer{}
	var err error
	err = yaml.Unmarshal([]byte(input.Yaml), &fabricPeer)
	if err != nil {
		return nil, err
	}
	fabricPeerResponse, err := r.HLFClient.HlfV1alpha1().FabricPeers(fabricPeer.Namespace).Create(ctx, &fabricPeer, v1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	return mapPeer(*fabricPeerResponse)
}

func (r *mutationResolver) UpdatePeer(ctx context.Context, filter models.NameAndNamespace, input models.UpdateePeerInput) (*models.Peer, error) {
	fabricPeer := v1alpha1.FabricPeer{}
	var err error
	err = yaml.Unmarshal([]byte(input.Yaml), &fabricPeer)
	if err != nil {
		return nil, err
	}
	fabricPeerResponse, err := r.HLFClient.HlfV1alpha1().FabricPeers(filter.Namespace).Update(ctx, &fabricPeer, v1.UpdateOptions{})
	if err != nil {
		return nil, err
	}
	return mapPeer(*fabricPeerResponse)

}

func (r *mutationResolver) CreateOrderer(ctx context.Context, input models.CreateOrdererInput) (*models.Orderer, error) {
	fabricOrdererNode := v1alpha1.FabricOrdererNode{}
	var err error
	err = yaml.Unmarshal([]byte(input.Yaml), &fabricOrdererNode)
	if err != nil {
		return nil, err
	}
	fabricOrdererNodeResponse, err := r.HLFClient.HlfV1alpha1().FabricOrdererNodes(fabricOrdererNode.Namespace).Create(ctx, &fabricOrdererNode, v1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	return mapOrderer(*fabricOrdererNodeResponse)
}

func (r *mutationResolver) UpdateOrderer(ctx context.Context, filter models.NameAndNamespace, input models.UpdateeOrdererInput) (*models.Orderer, error) {
	fabricOrdererNode := v1alpha1.FabricOrdererNode{}
	var err error
	err = yaml.Unmarshal([]byte(input.Yaml), &fabricOrdererNode)
	if err != nil {
		return nil, err
	}
	fabricOrdererNodeResponse, err := r.HLFClient.HlfV1alpha1().FabricOrdererNodes(filter.Namespace).Update(ctx, &fabricOrdererNode, v1.UpdateOptions{})
	if err != nil {
		return nil, err
	}
	return mapOrderer(*fabricOrdererNodeResponse)
}

func (r *mutationResolver) CreateCa(ctx context.Context, input models.CreateCAInput) (*models.Ca, error) {
	fabricCA := v1alpha1.FabricCA{}
	var err error
	err = yaml.Unmarshal([]byte(input.Yaml), &fabricCA)
	if err != nil {
		return nil, err
	}
	fabricCAResponse, err := r.HLFClient.HlfV1alpha1().FabricCAs(fabricCA.Namespace).Create(ctx, &fabricCA, v1.CreateOptions{})
	if err != nil {
		return nil, err
	}
	return mapCA(*fabricCAResponse)
}

func (r *mutationResolver) UpdateCa(ctx context.Context, filter models.NameAndNamespace, input models.UpdateCAInput) (*models.Ca, error) {
	fabricCA := v1alpha1.FabricCA{}
	var err error
	err = yaml.Unmarshal([]byte(input.Yaml), &fabricCA)
	if err != nil {
		return nil, err
	}
	fabricCAResponse, err := r.HLFClient.HlfV1alpha1().FabricCAs(filter.Namespace).Update(ctx, &fabricCA, v1.UpdateOptions{})
	if err != nil {
		return nil, err
	}
	return mapCA(*fabricCAResponse)
}

func (r *mutationResolver) RenewPeerCertificates(ctx context.Context, input models.RenewPeerCertificatesInput) (*models.RenewPeerCertificatesResponse, error) {
	fabricPeer, err := r.HLFClient.HlfV1alpha1().FabricPeers(input.Namespace).Get(ctx, input.Name, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	now := v1.NewTime(time.Now())
	fabricPeer.Spec.UpdateCertificateTime = &now
	fabricPeerResponse, err := r.HLFClient.HlfV1alpha1().FabricPeers(fabricPeer.Namespace).Update(ctx, fabricPeer, v1.UpdateOptions{})
	if err != nil {
		return nil, err
	}
	peerGQL, err := mapPeer(*fabricPeerResponse)
	if err != nil {
		return nil, err
	}
	return &models.RenewPeerCertificatesResponse{
		Peer:   peerGQL,
		Errors: []*models.Error{},
	}, nil

}

func (r *mutationResolver) RenewOrdererCertificates(ctx context.Context, input models.RenewOrdererCertificatesInput) (*models.RenewOrdererCertificatesResponse, error) {
	fabricOrderer, err := r.HLFClient.HlfV1alpha1().FabricOrdererNodes(input.Namespace).Get(ctx, input.Name, v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	now := v1.NewTime(time.Now())
	fabricOrderer.Spec.UpdateCertificateTime = &now
	fabricOrdererResponse, err := r.HLFClient.HlfV1alpha1().FabricOrdererNodes(fabricOrderer.Namespace).Update(ctx, fabricOrderer, v1.UpdateOptions{})
	if err != nil {
		return nil, err
	}
	ordererGQL, err := mapOrderer(*fabricOrdererResponse)
	if err != nil {
		return nil, err
	}
	return &models.RenewOrdererCertificatesResponse{
		Orderer: ordererGQL,
		Errors:  []*models.Error{},
	}, nil
}
