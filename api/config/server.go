package config

type FileConfig struct {
	Organizations []OrganizationConfig `yaml:"organizations"`
}
type OrganizationConfig struct {
	MSPID string `yaml:"mspID"`
	User  string `yaml:"user"`
}
