package serve

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/apollotracing"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/kfsoftware/hlf-operator-ui/api/gql"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/resolvers"
	"github.com/kfsoftware/hlf-operator-ui/api/log"
	operatorv1 "github.com/kfsoftware/hlf-operator/pkg/client/clientset/versioned"
	"github.com/spf13/cobra"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"net/http"
)

type serveConfig struct {
	address string
}
type serveCmd struct {
	address string
}

func (s serveCmd) run() error {
	kubeConfigPath := "/Users/davidviejo/projects/kfs/hlf-operator-ui/api/.dev/kubeconfig.yaml"
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
	config := gql.Config{
		Resolvers: &resolvers.Resolver{
			Config:     kubeConfig,
			KubeClient: kubeClient,
			HLFClient:  hlfClient,
		},
	}
	es := gql.NewExecutableSchema(config)
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
	playgroundHandler := playground.Handler("GraphQL", "/graphql")

	graphqlHandler := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Access-Control-Allow-Origin", "*")
		writer.Header().Set("Access-Control-Allow-Credentials", "true")
		writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Identity")
		writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		h.ServeHTTP(writer, request)
	})
	serverMux := http.NewServeMux()
	serverMux.HandleFunc(
		"/graphql",
		graphqlHandler,
	)
	serverMux.HandleFunc(
		"/playground",
		playgroundHandler,
	)
	log.Infof("Server listening on %s", s.address)
	return http.ListenAndServe(s.address, serverMux)
}
func NewServeCommand() *cobra.Command {
	conf := &serveConfig{}
	cmd := &cobra.Command{
		Use:   "serve",
		Short: "serve",
		Long:  "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			s := &serveCmd{
				address: conf.address,
			}
			return s.run()
		},
	}
	f := cmd.Flags()
	f.StringVar(&conf.address, "address", "", "address for the server")
	return cmd
}
