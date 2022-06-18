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
