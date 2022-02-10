package resolvers

import (
	"context"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/models"
	"github.com/kfsoftware/hlf-operator/api/hlf.kungfusoftware.es/v1alpha1"
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
