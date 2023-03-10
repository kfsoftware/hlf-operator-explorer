package serve

import (
	"context"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"embed"
	"fmt"
	gqlgengraphql "github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/apollotracing"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	"github.com/form3tech-oss/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/core"
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	apiconfig "github.com/kfsoftware/hlf-operator-ui/api/config"
	cmdconfig "github.com/kfsoftware/hlf-operator-ui/api/config"
	"github.com/kfsoftware/hlf-operator-ui/api/gql"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/resolvers"
	"github.com/kfsoftware/hlf-operator-ui/api/log"
	"github.com/kfsoftware/hlf-operator-ui/api/ui"
	"github.com/kfsoftware/hlf-operator/controllers/utils"
	operatorv1 "github.com/kfsoftware/hlf-operator/pkg/client/clientset/versioned"
	"github.com/lestrrat-go/jwx/jwk"
	"github.com/pkg/errors"
	"github.com/slok/go-http-metrics/metrics/prometheus"
	"github.com/slok/go-http-metrics/middleware"
	middlewarestd "github.com/slok/go-http-metrics/middleware/std"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"gopkg.in/yaml.v3"
	"io"
	"io/ioutil"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"net/http"
	"os"
	"strings"
	"time"
)

type serveConfig struct {
	address    string
	hlfConfig  string
	user       string
	mspID      string
	authJWKS   string
	authIssuer string
	config     string
}
type serveCmd struct {
	address    string
	hlfConfig  string
	user       string
	mspID      string
	authJWKS   string
	authIssuer string
	config     string
	views      embed.FS
}

type IdentityStruct struct {
	Identity identity.Identity
	Sign     identity.Sign
}

func getGateway(clientConnection *grpc.ClientConn, identity *IdentityStruct) (*client.Gateway, error) {
	gw, err := client.Connect(
		identity.Identity,
		client.WithSign(identity.Sign),
		client.WithClientConnection(clientConnection),
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		return nil, err
	}
	return gw, nil
}
func (s serveCmd) run() error {
	kubeConfigPath := os.Getenv("KUBECONFIG")
	kubeConfig, err := clientcmd.BuildConfigFromFlags("", kubeConfigPath)
	if err != nil {
		return err
	}
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		return err
	}
	hlfClient, err := operatorv1.NewForConfig(kubeConfig)
	if err != nil {
		return err
	}
	var sdk *fabsdk.FabricSDK
	var cfgProvider []core.ConfigBackend
	var gw *client.Gateway
	var fConfig *apiconfig.FileConfig
	if s.hlfConfig != "" {
		configBackend := config.FromFile(s.hlfConfig)
		cfgProvider, err = configBackend()
		if err != nil {
			return err
		}
		sdk, err = fabsdk.New(configBackend)
		if err != nil {
			return err
		}
		configBackend1, err := sdk.Config()
		if err != nil {
			return err
		}

		peersInt, _ := configBackend1.Lookup(fmt.Sprintf("organizations.%s.peers", s.mspID))
		peersArrayInterface := peersInt.([]interface{})
		var peers []string
		idx := 0
		var peerUrl string
		var peerTLSCACert []byte
		for _, item := range peersArrayInterface {
			peerName := item.(string)
			peers = append(peers, peerName)
			peerUrlKey := fmt.Sprintf("peers.%s.url", peerName)
			peerTLSCACertKey := fmt.Sprintf("peers.%s.tlsCACerts.pem", peerName)
			peerUrlInt, _ := configBackend1.Lookup(peerUrlKey)
			peerTLSCACertInt, _ := configBackend1.Lookup(peerTLSCACertKey)
			peerUrl = strings.Replace(peerUrlInt.(string), "grpcs://", "", -1)
			peerTLSCACert = []byte(peerTLSCACertInt.(string))
			idx++
			if idx >= 1 {
				break
			}
		}
		userCertKey := fmt.Sprintf("organizations.%s.users.%s.cert.pem", s.mspID, s.user)
		userPrivateKey := fmt.Sprintf("organizations.%s.users.%s.key.pem", s.mspID, s.user)
		userPrivateCertString, certExists := configBackend1.Lookup(userCertKey)
		if !certExists {
			return fmt.Errorf("user cert not found")
		}
		userPrivateKeyString, keyExists := configBackend1.Lookup(userPrivateKey)
		if !keyExists {
			return fmt.Errorf("user key not found")
		}
		grpcConn, err := newGrpcConnection(peerUrl, peerTLSCACert)
		if err != nil {
			return err
		}
		cert, err := utils.ParseX509Certificate([]byte(userPrivateCertString.(string)))
		if err != nil {
			return err
		}
		x509Identity, err := identity.NewX509Identity(s.mspID, cert)
		if err != nil {
			return err
		}
		privateKey, err := identity.PrivateKeyFromPEM([]byte(userPrivateKeyString.(string)))
		if err != nil {
			return err
		}
		sign, err := identity.NewPrivateKeySign(privateKey)
		if err != nil {
			return err
		}
		gw, err = getGateway(grpcConn, &IdentityStruct{
			Identity: x509Identity,
			Sign:     sign,
		})
		if err != nil {
			return err
		}
	}
	organizations := map[string]apiconfig.OrganizationConfig{}
	if s.config != "" {
		fileBytes, err := ioutil.ReadFile(s.config)
		if err != nil {
			return errors.Wrapf(err, "failed to read config file %s", s.config)
		}
		err = yaml.Unmarshal(fileBytes, &fConfig)
		if err != nil {
			return errors.Wrapf(err, "failed to unmarshal config file %s", s.config)
		}
		for _, organization := range fConfig.Organizations {
			organizations[organization.MSPID] = organization
		}
	}

	gqlConfig := gql.Config{
		Resolvers: &resolvers.Resolver{
			MSPID:          s.mspID,
			User:           s.user,
			KubeClient:     kubeClient,
			Config:         kubeConfig,
			HLFClient:      hlfClient,
			FabricSDK:      sdk,
			ConfigBackends: cfgProvider,
			Gateway:        gw,
			Organizations:  organizations,
		},
	}
	gqlConfig.Directives.RequiresAuth = func(ctx context.Context, obj interface{}, next gqlgengraphql.Resolver) (interface{}, error) {
		if s.authJWKS == "" || s.authIssuer == "" {
			return next(ctx)
		}
		user := ctx.Value("user")
		if user == nil {
			return nil, errors.New("access denied")
		}
		return next(ctx)
	}
	es := gql.NewExecutableSchema(gqlConfig)
	h := handler.New(es)
	h.AddTransport(transport.Options{})
	h.AddTransport(transport.GET{})
	h.AddTransport(transport.POST{})
	h.AddTransport(transport.MultipartForm{})

	h.SetQueryCache(lru.New(1000))
	h.Use(extension.Introspection{})
	h.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})
	h.Use(apollotracing.Tracer{})
	serverMux := gin.Default()
	serverMux.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "PUT", "PATCH"},
		AllowHeaders:     []string{"X-MC-User", "X-MC-MSPID", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 12 * time.Hour,
	}))

	fileSystem := ui.NewFileSystemUI(s.views, "web")
	serverMux.Use(static.Serve("/", fileSystem))
	serverMux.NoRoute(ReturnPublic(s.views))

	graphqlHandler := gin.HandlerFunc(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Identity")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		h.ServeHTTP(c.Writer, c.Request)
	})
	serverMux.Any(
		"/graphql",
		graphqlHandler,
	)
	serverMux.GET(
		"/playground",
		playgroundHandler(),
	)
	serverMux.GET(
		"/healthz",
		func(c *gin.Context) {
			c.Writer.WriteHeader(http.StatusOK)
			c.Writer.Header().Set("Content-Type", "application/json")
			io.WriteString(c.Writer, `{"alive": true}`)
		},
	)
	mdlw := middleware.New(middleware.Config{
		Recorder: prometheus.NewRecorder(prometheus.Config{}),
	})
	httpHandler := middlewarestd.Handler("", mdlw, serverMux)
	if s.authIssuer != "" && s.authJWKS != "" {
		jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
			ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
				iss := s.authIssuer
				checkIss := token.Claims.(jwt.MapClaims).VerifyIssuer(iss, false)
				if !checkIss {
					return token, errors.New("Invalid issuer.")
				}

				cert, err := getPemCert(token, s.authJWKS)
				if err != nil {
					return nil, err
				}
				return cert, nil
			},
			SigningMethod:       jwt.SigningMethodRS256,
			CredentialsOptional: true,
		})
		httpHandler = jwtMiddleware.Handler(httpHandler)
	}
	log.Infof("Server listening on %s", s.address)
	return http.ListenAndServe(s.address, httpHandler)
}

func ReturnPublic(views embed.FS) gin.HandlerFunc {
	return func(context *gin.Context) {
		method := context.Request.Method
		if method == "GET" {
			index, err := views.Open("web/index.html")
			if err != nil {
				context.AbortWithStatus(http.StatusNotFound)
				return
			}
			defer index.Close()
			data, err := io.ReadAll(index)
			if err != nil {
				context.AbortWithStatus(http.StatusNotFound)
				return
			}
			context.Data(http.StatusOK, "text/html; charset=utf-8", data)
		} else {
			context.Next()
		}
	}
}

// Defining the Playground handler
func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/graphql")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// newGrpcConnection creates a gRPC connection to the Gateway server.
func newGrpcConnection(peerEndpoint string, tlsCert []byte) (*grpc.ClientConn, error) {
	certificate, err := identity.CertificateFromPEM(tlsCert)
	if err != nil {
		return nil, fmt.Errorf("failed to obtain commit status: %w", err)
	}

	certPool := x509.NewCertPool()
	certPool.AddCert(certificate)
	transportCredentials := credentials.NewClientTLSFromCert(certPool, "")

	connection, err := grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(transportCredentials))
	if err != nil {
		return nil, fmt.Errorf("failed to evaluate transaction: %w", err)
	}

	return connection, nil
}

func NewServeCommand(cmdConfig cmdconfig.ConfigCMD) *cobra.Command {
	conf := &serveConfig{}
	cmd := &cobra.Command{
		Use:   "serve",
		Short: "serve",
		Long:  "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			s := &serveCmd{
				address:    conf.address,
				hlfConfig:  conf.hlfConfig,
				user:       conf.user,
				mspID:      conf.mspID,
				authJWKS:   conf.authJWKS,
				authIssuer: conf.authIssuer,
				config:     conf.config,
				views:      cmdConfig.Views,
			}
			return s.run()
		},
	}
	f := cmd.Flags()
	f.StringVar(&conf.address, "address", "", "address for the server")
	f.StringVar(&conf.hlfConfig, "hlf-config", "", "HLF configuration")
	f.StringVar(&conf.mspID, "msp-id", "", "MSP ID to use for the HLF configuration")
	f.StringVar(&conf.user, "user", "", "User to use for the HLF configuration")
	f.StringVarP(&conf.authJWKS, "auth-jwks", "", "", "auth jwks")
	f.StringVarP(&conf.authIssuer, "auth-issuer", "", "", "auth issuer")
	f.StringVarP(&conf.config, "config", "", "", "API configuration file")
	return cmd
}

type Jwks struct {
	Keys []JSONWebKeys `json:"keys"`
}

type JSONWebKeys struct {
	Kty string   `json:"kty"`
	Kid string   `json:"kid"`
	Use string   `json:"use"`
	N   string   `json:"n"`
	E   string   `json:"e"`
	X5c []string `json:"x5c"`
}

func getPemCert(token *jwt.Token, jwksUrl string) (*rsa.PublicKey, error) {
	kid := token.Header["kid"].(string)
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	httpClient := &http.Client{Transport: tr}
	set, err := jwk.Fetch(context.Background(), jwksUrl, jwk.WithHTTPClient(httpClient))
	if err != nil {
		log.Printf("failed to parse JWK: %s", err)
		return nil, err
	}
	k, exists := set.LookupKeyID(kid)
	if !exists {
		return nil, errors.Errorf("kid %s not found in jwks", kid)
	}
	var rawKey interface{}
	err = k.Raw(&rawKey)
	if !exists {
		return nil, err
	}
	rsaKey, ok := rawKey.(*rsa.PublicKey)
	if !ok {
		return nil, errors.Errorf("kid %s not found in jwks", kid)
	}
	return rsaKey, nil
}
