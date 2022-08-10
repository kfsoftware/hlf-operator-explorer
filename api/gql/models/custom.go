package models

type Channel struct {
	Name          string             `json:"name"`
	RawConfig     string             `json:"rawConfig"`
	ProtoConfig   string             `json:"protoConfig"`
	ChannelConfig *ChannelConfig     `json:"channelConfig"`
	Application   *ApplicationConfig `json:"application"`
	Orderer       *OrdererConfig     `json:"orderer"`
	Height        int                `json:"height"`
}

type Peer struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
	Yaml      string `json:"yaml"`
}
type Orderer struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
	Yaml      string `json:"yaml"`
}
type Ca struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
	Yaml      string `json:"yaml"`
}
