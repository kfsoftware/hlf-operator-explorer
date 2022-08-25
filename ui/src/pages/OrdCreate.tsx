import { RadioGroup } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useCallback, useEffect, useMemo } from "react";
import {
  FormProvider,
  RegisterOptions,
  useForm,
  useFormContext,
  UseFormRegister
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { parse, stringify } from "yaml";
import * as yup from "yup";
import ArrayField from "../components/inputs/ArrayField";
import SelectField from "../components/inputs/SelectField";
import TextField from "../components/inputs/TextField";
import ToggleField from "../components/inputs/ToggleField";
import SubmitButton from "../components/SubmitButton";
import {
  useCreateOrdererMutation,
  useGetCAsQuery,
  useGetNamespacesQuery
} from "../operations";

/* This example requires Tailwind CSS v2.0+ */
function Heading() {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          New Orderer node
        </h2>
      </div>
    </div>
  );
}
/* This example requires Tailwind CSS v2.0+ */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pb-5 border-b border-gray-200">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
  );
}
interface InputTextProps {
  label: string;
  onChange: any;
  onBlur: any;
  name: any;
}
const InputText = forwardRef(
  ({ label, name, onBlur, onChange, ...props }: InputTextProps, ref) => {
    const id = useMemo(() => label, [label]);
    const methods = useFormContext();
    return (
      <div className="sm:col-span-3">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            ref={ref as any}
            type="text"
            {...props}
            onBlur={onBlur}
            onChange={onChange}
            name={name}
            id={id}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
    );
  }
);
interface InputTextProps {
  label: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SelectItem {
  name: string;
  id: string;
  description?: string;
}
interface RadioGroupProps {
  name: string;
  label: string;
  options: RegisterOptions;
  items: SelectItem[];
}
function RadioGroupField({ name, label, items, options }: RadioGroupProps) {
  const cachedItems = useMemo(() => items, []);
  const { formState, watch, register, setValue } = useFormContext();
  const errorMessage = formState?.errors?.[name]?.message;
  const selectValue: string | null = watch(name) || null;
  useEffect(() => {
    register(name, options);
  }, [name, options]);
  const handleChange = (val: string) =>
    setValue(name, val, { shouldValidate: true });
  const hasError = !!errorMessage;

  return (
    <RadioGroup value={selectValue} onChange={handleChange}>
      <RadioGroup.Label
        className={classNames(
          "block text-sm font-medium ",
          hasError ? "text-red-700" : "text-gray-700"
        )}
      >
        {label}
      </RadioGroup.Label>
      <div className="bg-white rounded-md -space-y-px">
        {cachedItems.map((setting, settingIdx) => (
          <RadioGroup.Option
            key={setting.name}
            value={setting.id}
            className={({ checked }) => {
              return classNames(
                settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                settingIdx === cachedItems.length - 1
                  ? "rounded-bl-md rounded-br-md"
                  : "",
                "relative pr-4 pt-4 pb-4 flex cursor-pointer focus:outline-none"
              );
            }}
          >
            {({ active, checked }) => {
              return (
                <>
                  <span
                    className={classNames(
                      checked
                        ? "bg-indigo-600 border-transparent"
                        : "bg-white border-gray-300",
                      active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                      "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <div className="ml-3 flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-900" : "text-gray-900",
                        "block text-sm font-medium"
                      )}
                    >
                      {setting.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "block text-sm"
                      )}
                    >
                      {setting.description}
                    </RadioGroup.Description>
                  </div>
                </>
              );
            }}
          </RadioGroup.Option>
        ))}
      </div>
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errorMessage}
        </p>
      ) : null}
    </RadioGroup>
  );
}
const worldStates = [
  {
    name: "LevelDB",
    id: "leveldb",
    description: "LevelDB world state",
  },
  {
    name: "CouchDB",
    id: "couchdb",
    description: "CouchDB world state",
  },
];
const defaultFabricOrdererYaml = `
apiVersion: hlf.kungfusoftware.es/v1alpha1
kind: FabricOrdererNode
metadata:
  name: orderer0-orderermsp-vaaq
  namespace: default
spec:
  adminIstio:
    hosts:
      - admin-orderer0-orderermsp-vaaq.hlf.kfs.es
    ingressGateway: ''
    port: 443
  bootstrapMethod: none
  channelParticipationEnabled: true
  env: null
  genesis: ''
  hostAliases: null
  image: hyperledger/fabric-orderer
  istio:
    hosts:
      - orderer0-orderermsp-vaaq.hlf.kfs.es
    ingressGateway: ''
    port: 443
  mspID: orderermsp
  pullPolicy: IfNotPresent
  replicas: 1
  resources: {}
  secret:
    enrollment:
      component:
        cahost: ca-orderermsp.hlf.kfs.es
        caname: ca
        caport: 443
        catls:
          cacert: >-
            LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNXakNDQWYrZ0F3SUJBZ0lSQU94OXVhRURJTml4WDRwa1NqWVJzSnd3Q2dZSUtvWkl6ajBFQXdJd1hURUwKTUFrR0ExVUVCaE1DUlZVeEVUQVBCZ05WQkFjVENFRnNhV05oYm5SbE1SRXdEd1lEVlFRSkV3aEJiR2xqWVc1MApaVEVaTUJjR0ExVUVDaE1RUzFWT1J5QkdWU0JUVDBaVVYwRlNSVEVOTUFzR0ExVUVDeE1FVkdWamFEQWVGdzB5Ck1qQXpNVGt3TnpNMk16aGFGdzB6TWpBek1qQXdOek0yTXpoYU1GMHhDekFKQmdOVkJBWVRBa1ZWTVJFd0R3WUQKVlFRSEV3aEJiR2xqWVc1MFpURVJNQThHQTFVRUNSTUlRV3hwWTJGdWRHVXhHVEFYQmdOVkJBb1RFRXRWVGtjZwpSbFVnVTA5R1ZGZEJVa1V4RFRBTEJnTlZCQXNUQkZSbFkyZ3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CCkJ3TkNBQVQ4NmhJM21rOGpyVkNxeGgvaE5ZcHk5cjJEU3pUNHZYbEtocnNFTTVZeEpWcDRFcWUrNSs3a29EZHMKYjF3L21EZ0JHaWNvWUNQeVF6VHRpZlYxL294eG80R2ZNSUdjTUE0R0ExVWREd0VCL3dRRUF3SUJwakFkQmdOVgpIU1VFRmpBVUJnZ3JCZ0VGQlFjREFnWUlLd1lCQlFVSEF3RXdEd1lEVlIwVEFRSC9CQVV3QXdFQi96QXBCZ05WCkhRNEVJZ1FnODIvYjdpelJnM2NHaVgyQW5lbXpFMGo3SVVWbW1CUDYxQVdQSVhDVTNLb3dMd1lEVlIwUkJDZ3cKSm9JWVkyRXRiM0prWlhKbGNtMXpjQzVvYkdZdWEyWnpMbVZ6aHdSL0FBQUJod1FLQndBRU1Bb0dDQ3FHU000OQpCQU1DQTBrQU1FWUNJUUNkUitSM2lCa1U2cHlFY2xCTGhHdzlrbldvdFNnemt5a3NTYXVrcHVCeEF3SWhBUCtNCk9zZW9KOVR6OE1BY1IxbEIvNUt5eFlUSzNtSHhBTitFZTRpTFRiRU0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
        enrollid: orderer
        enrollsecret: UR1WFu7gchBN934n50p6baIrJ28EkoOT
      tls:
        cahost: ca-orderermsp.hlf.kfs.es
        caname: tlsca
        caport: 443
        catls:
          cacert: >-
            LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNXakNDQWYrZ0F3SUJBZ0lSQU94OXVhRURJTml4WDRwa1NqWVJzSnd3Q2dZSUtvWkl6ajBFQXdJd1hURUwKTUFrR0ExVUVCaE1DUlZVeEVUQVBCZ05WQkFjVENFRnNhV05oYm5SbE1SRXdEd1lEVlFRSkV3aEJiR2xqWVc1MApaVEVaTUJjR0ExVUVDaE1RUzFWT1J5QkdWU0JUVDBaVVYwRlNSVEVOTUFzR0ExVUVDeE1FVkdWamFEQWVGdzB5Ck1qQXpNVGt3TnpNMk16aGFGdzB6TWpBek1qQXdOek0yTXpoYU1GMHhDekFKQmdOVkJBWVRBa1ZWTVJFd0R3WUQKVlFRSEV3aEJiR2xqWVc1MFpURVJNQThHQTFVRUNSTUlRV3hwWTJGdWRHVXhHVEFYQmdOVkJBb1RFRXRWVGtjZwpSbFVnVTA5R1ZGZEJVa1V4RFRBTEJnTlZCQXNUQkZSbFkyZ3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CCkJ3TkNBQVQ4NmhJM21rOGpyVkNxeGgvaE5ZcHk5cjJEU3pUNHZYbEtocnNFTTVZeEpWcDRFcWUrNSs3a29EZHMKYjF3L21EZ0JHaWNvWUNQeVF6VHRpZlYxL294eG80R2ZNSUdjTUE0R0ExVWREd0VCL3dRRUF3SUJwakFkQmdOVgpIU1VFRmpBVUJnZ3JCZ0VGQlFjREFnWUlLd1lCQlFVSEF3RXdEd1lEVlIwVEFRSC9CQVV3QXdFQi96QXBCZ05WCkhRNEVJZ1FnODIvYjdpelJnM2NHaVgyQW5lbXpFMGo3SVVWbW1CUDYxQVdQSVhDVTNLb3dMd1lEVlIwUkJDZ3cKSm9JWVkyRXRiM0prWlhKbGNtMXpjQzVvYkdZdWEyWnpMbVZ6aHdSL0FBQUJod1FLQndBRU1Bb0dDQ3FHU000OQpCQU1DQTBrQU1FWUNJUUNkUitSM2lCa1U2cHlFY2xCTGhHdzlrbldvdFNnemt5a3NTYXVrcHVCeEF3SWhBUCtNCk9zZW9KOVR6OE1BY1IxbEIvNUt5eFlUSzNtSHhBTitFZTRpTFRiRU0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
        csr:
          cn: orderer0-orderermsp
          hosts:
            - orderer0-orderermsp-vaaq.hlf.kfs.es
            - admin-orderer0-orderermsp-vaaq.hlf.kfs.es
            - localhost
            - 127.0.0.1
        enrollid: orderer
        enrollsecret: UR1WFu7gchBN934n50p6baIrJ28EkoOT
  service:
    type: NodePort
  serviceMonitor:
    enabled: true
    interval: 10s
    labels: {}
    sampleLimit: 0
    scrapeTimeout: 10s
  storage:
    accessMode: ReadWriteOnce
    size: 2Gi
    storageClass: default
  tag: amd64-2.4.3
  tolerations:
    - effect: NoSchedule
      key: kubernetes.azure.com/scalesetpriority
      operator: Equal
      value: spot
  updateCertificateTime: null
`;
interface CouchDB {
  image: string;
  version: string;
  imagePullPolicy: string;
  user: string;
  password: string;
}
interface OrdererForm {
  enrollSecret: string;
  enrollID: string;
  couchdb: CouchDB;
  name: string;
  namespace: SelectItem;
  image: string;
  version: string;
  imagePullSecrets: string[];
  storageClass: SelectItem;
  capacity: string;
  serviceType: SelectItem;
  hosts: [];
  mspID: string;
  ca: SelectItem | null;
  serviceMonitor: ServiceMonitor;
  ingressPort: string;
  ingressGateway: string;
  externalEndpoint: string;
  worldState: string;
  resources: OrdererResources;

  k8sChaincodeBuilder: K8SChaincodeBuilder;
  istioEnabled: boolean;
}
interface Resources {
  limits: {
    cpu: string;
    memory: string;
  };
  requests: {
    cpu: string;
    memory: string;
  };
}
interface OrdererResources {
  Orderer: Resources;
  couchdb: Resources;
}
interface K8SChaincodeBuilder {
  enabled: boolean;
}
interface ResourcesFieldProps {
  register: UseFormRegister<any>;
  name: string;
}
function ResourcesField({ register, name }: ResourcesFieldProps) {
  return (
    <>
      <fieldset>
        <legend className="sr-only">Resource requests</legend>
        <div className="text-base font-medium text-gray-900" aria-hidden="true">
          Resource requests
        </div>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 space-x-4">
            <TextField
              name={`${name}.requests.cpu`}
              label={"CPU"}
              register={register}
            />
            <TextField
              name={`${name}.requests.memory`}
              label={"Memory"}
              register={register}
            />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend className="sr-only">Resource limits</legend>
        <div className="text-base font-medium text-gray-900" aria-hidden="true">
          Resource limits
        </div>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 space-x-4">
            <TextField
              name={`${name}.limits.cpu`}
              label={"CPU"}
              register={register}
            />
            <TextField
              name={`${name}.limits.memory`}
              label={"Memory"}
              register={register}
            />
          </div>
        </div>
      </fieldset>
    </>
  );
}

interface ServiceMonitor {
  enabled: boolean;
  labels: { [key: string]: string };
  sampleLimit: string;
  interval: string;
  scrapeTimeout: string;
}
export const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  namespace: yup
    .object()
    .shape({
      id: yup.string().required("Service Type is required"),
    })
    .required("Namespace is required"),
  image: yup.string().required("Image is required"),
  version: yup.string().required("Version is required"),
  worldState: yup.string().required("World State is required"),
  externalEndpoint: yup.string().required("External Endpoint is required"),
  serviceType: yup
    .object()
    .shape({
      id: yup.string().required("Service Type is required"),
    })
    .required("Service Type is required"),
  capacity: yup.string().required("Capacity is required"),
  mspID: yup.string().required("MSP ID is required"),
  storageClass: yup
    .object()
    .shape({
      id: yup.string().required("Storage Class is required"),
    })
    .required("Storage Class is required"),
  hosts: yup.array().required("Hosts is required"),
  ca: yup
    .object()
    .required("CA is required")
    .shape({
      id: yup.string().required("CA is required"),
    })
    .required("CA is required"),
  enrollID: yup.string().required("Enroll ID is required"),
  enrollSecret: yup.string().required("Enroll Secret is required"),
});
export default function OrdererCreate() {
  const casData = useGetCAsQuery();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      worldState: worldStates[1].id,
      externalEndpoint: "",
      name: "Orderer0-org1",
      namespace: {
        id: "default",
        name: "default",
      },
      enrollID: "",
      enrollSecret: "",
      serviceType: {
        id: "ClusterIP",
        name: "ClusterIP",
        description: "",
      },
      capacity: "1Gi",
      storageClass: {
        id: "default",
        name: "default",
        description: "",
      },
      image: "hyperledger/fabric-Orderer",
      version: "amd64-2.4.3",
      hosts: [],
      istioEnabled: false,
      ingressGateway: "",
      ingressPort: "443",
      imagePullSecrets: [],
      mspID: "",
      k8sChaincodeBuilder: {
        enabled: false,
      },
      ca: null,
      serviceMonitor: {
        enabled: false,
        interval: "10s",
        labels: {},
        sampleLimit: "0",
        scrapeTimeout: "10s",
      },
      couchdb: {
        image: "couchdb",
        version: "3.1.1",
        imagePullPolicy: "IfNotPresent",
        user: "couchdb",
        password: "couchdb",
      },
      resources: {
        Orderer: {
          requests: {
            cpu: "500m",
            memory: "256Mi",
          },
          limits: {
            cpu: "1",
            memory: "1Gi",
          },
        },
        couchdb: {
          requests: {
            cpu: "500m",
            memory: "256Mi",
          },
          limits: {
            cpu: "1",
            memory: "1Gi",
          },
        },
      },
    } as OrdererForm,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = methods;
  const [createOrderer, createOrdererData] = useCreateOrdererMutation();
  const navigate = useNavigate();

  const { data, loading, error } = useGetNamespacesQuery();
  const namespaces = useMemo(() => {
    return (
      data?.namespaces?.map((i) => ({
        id: i.name,
        name: i.name,
      })) || []
    );
  }, [data]);
  const serviceTypes = useMemo(() => {
    return [
      {
        id: "NodePort",
        name: "NodePort",
        description: "",
      },
      {
        id: "LoadBalancer",
        name: "LoadBalancer",
        description: "",
      },
      {
        id: "ClusterIP",
        name: "ClusterIP",
        description: "",
      },
    ] as SelectItem[];
  }, []);
  const cas = useMemo(() => {
    return (
      casData.data?.cas?.map((ca) => {
        return {
          id: `${ca.name}.${ca.namespace}`,
          name: `${ca.name}.${ca.namespace}`,
        };
      }) || []
    );
  }, [casData]);

  useEffect(() => {
    if (!getValues("namespace")) {
      setValue("namespace", namespaces.filter((i) => i.name === "default")[0]);
    }
  }, [namespaces, watch("namespace")]);
  const realTimeYaml = useMemo(() => {
    const parsedFabricOrdererYaml = parse(defaultFabricOrdererYaml);
    parsedFabricOrdererYaml.metadata.name = getValues("name");
    parsedFabricOrdererYaml.metadata.namespace = getValues("namespace")?.name;
    // parsedFabricOrdererYaml.spec.image = getValues("image");
    // parsedFabricOrdererYaml.spec.version = getValues("version");
    // parsedFabricOrdererYaml.spec.mspID = getValues("mspID");
    // parsedFabricOrdererYaml.spec.stateDb = getValues("worldState");

    // parsedFabricOrdererYaml.spec.hosts = getValues("hosts");
    // if (getValues("istioEnabled")) {
    //   parsedFabricOrdererYaml.spec.istio.hosts = getValues("hosts");
    //   parsedFabricOrdererYaml.spec.istio.ingressGateway =
    //     getValues("ingressGateway");
    //   parsedFabricOrdererYaml.spec.istio.port = parseInt(getValues("ingressPort"));
    // }
    // parsedFabricOrdererYaml.spec.externalEndpoint = getValues("externalEndpoint");
    // parsedFabricOrdererYaml.spec.gossip.endpoint = getValues("externalEndpoint");
    // parsedFabricOrdererYaml.spec.gossip.externalEndpoint =
    //   getValues("externalEndpoint");
    // parsedFabricOrdererYaml.spec.service.type = getValues("serviceType.id");
    // parsedFabricOrdererYaml.spec.external_chaincode_builder = getValues(
    //   "k8sChaincodeBuilder.enabled"
    // );
    // if (getValues("serviceMonitor")?.enabled) {
    //   parsedFabricOrdererYaml.spec.serviceMonitor = {
    //     enabled: true,
    //     interval: getValues("serviceMonitor")?.interval,
    //     labels: getValues("serviceMonitor")?.labels,
    //     sampleLimit: parseInt(getValues("serviceMonitor")?.sampleLimit),
    //     scrapeTimeout: getValues("serviceMonitor")?.scrapeTimeout,
    //   };
    // } else {
    //   parsedFabricOrdererYaml.spec.serviceMonitor.enabled = false;
    //   parsedFabricOrdererYaml.spec.couchdb.image = getValues("couchdb.image");
    //   parsedFabricOrdererYaml.spec.couchdb.tag = getValues("couchdb.version");
    //   parsedFabricOrdererYaml.spec.couchdb.pullPolicy = getValues(
    //     "couchdb.imagePullPolicy"
    //   );
    //   parsedFabricOrdererYaml.spec.couchdb.user = getValues("couchdb.user");
    //   parsedFabricOrdererYaml.spec.couchdb.password =
    //     getValues("couchdb.password");
    // }
    // if (getValues("ca")) {
    //   const [caName, caNamespace] = getValues("ca.id").split(".");
    //   const cas = casData.data?.cas;
    //   const ca = cas?.find(
    //     (ca) => ca.name === caName && ca.namespace === caNamespace
    //   );
    //   const data = parse(ca?.yaml || "");
    //   console.log(data);
    //   const cahost = `${caName}.${caNamespace}`;
    //   const enrollId = getValues("enrollID");
    //   const enrollSecret = getValues("enrollSecret");
    //   parsedFabricOrdererYaml.spec.secret.enrollment.component.cahost = cahost;
    //   parsedFabricOrdererYaml.spec.secret.enrollment.tls.cahost = cahost;

    //   parsedFabricOrdererYaml.spec.secret.enrollment.component.enrollid = enrollId;
    //   parsedFabricOrdererYaml.spec.secret.enrollment.tls.enrollid = enrollId;

    //   parsedFabricOrdererYaml.spec.secret.enrollment.component.enrollsecret =
    //     enrollSecret;
    //   parsedFabricOrdererYaml.spec.secret.enrollment.tls.enrollsecret =
    //     enrollSecret;
    //   const tlsCert = data.status.tls_cert;
    //   parsedFabricOrdererYaml.spec.secret.enrollment.component.catls.cacert =
    //     btoa(tlsCert);
    //   parsedFabricOrdererYaml.spec.secret.enrollment.tls.catls.cacert =
    //     btoa(tlsCert);
    // }
    return stringify(parsedFabricOrdererYaml);
  }, [watch(), getValues, casData]);
  const onSubmit = useCallback(
    async (values) => {
      try {
        const { data } = await createOrderer({
          variables: {
            input: {
              yaml: realTimeYaml,
            },
          },
        });
        await navigate(
          `/Orderers/${data?.createOrderer?.namespace}/${data?.createOrderer?.name}`
        );
      } catch (e) {}
    },
    [realTimeYaml]
  );
  return (
    <FormProvider {...methods}>
      <div className="py-6">
        <div className="flex px-6">
          <div className="flex-none max-w-2xl">
            <h1 className="text-2xl font-bold">YAML Configuration</h1>
            <pre className="bg-gray-300 px-6 py-6 overflow-y-hidden">
              {realTimeYaml}
            </pre>
          </div>
          <div className="flex-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Heading />
              <div className="mt-8">
                <form
                  className="space-y-8 "
                  onSubmit={handleSubmit(onSubmit, console.log)}
                >
                  <SectionHeader title="Orderer configuration" />
                  <div className="space-y-8">
                    <TextField
                      label="Name"
                      name="name"
                      register={methods.register}
                    />
                    <SelectField
                      label="Namespace"
                      name="namespace"
                      items={namespaces}
                      register={methods.register}
                      options={{}}
                    />

                    <TextField
                      label="Image"
                      name="image"
                      register={methods.register}
                    />
                    <TextField
                      label="Version"
                      name="version"
                      register={methods.register}
                    />
                    <RadioGroupField
                      label="World state"
                      name="worldState"
                      items={worldStates}
                      options={{ required: true }}
                    />
                    <TextField
                      label="External Endpoint"
                      name="externalEndpoint"
                      register={register}
                    />
                  </div>
                  <SectionHeader title="Organization" />
                  <div className="space-y-8 ">
                    <SelectField
                      label="Certificate Authority"
                      name="ca"
                      items={cas}
                    />
                    <TextField
                      label="MSP ID"
                      name="mspID"
                      register={methods.register}
                    />
                    <TextField
                      label="Enroll ID"
                      name="enrollID"
                      register={methods.register}
                    />
                    <TextField
                      label="Enroll Secret"
                      name="enrollSecret"
                      register={methods.register}
                    />
                  </div>
                  <SectionHeader title="Ingress" />
                  <div className="space-y-8 ">
                    {/* service type   */}
                    <SelectField
                      label="Service Type"
                      name="serviceType"
                      items={serviceTypes.map((storageClass) => ({
                        id: storageClass.name,
                        name: storageClass.name,
                      }))}
                      options={{}}
                    />
                    <ToggleField
                      label="Enable Istio"
                      name="istioEnabled"
                      register={methods.register}
                      description={
                        <p>
                          Requires Istio installed, you can check how to install{" "}
                          <a
                            className="text-gray-900 font-medium hover:text-gray-600"
                            href="https://istio.io/latest/docs/setup/getting-started/"
                            target="_blank"
                          >
                            it in the official documentation
                          </a>
                        </p>
                      }
                    />
                    {watch("istioEnabled") && (
                      <>
                        {/* hosts */}
                        <ArrayField
                          name="hosts"
                          register={methods.register}
                          label={"Hosts"}
                          itemLabel="Host"
                        />

                        {/* ingress gateway */}
                        <TextField
                          label="Ingress gateway"
                          name="ingressGateway"
                          register={methods.register}
                        />

                        {/* ingress port */}
                        <TextField
                          label="Ingress port"
                          name="ingressPort"
                          register={methods.register}
                        />
                      </>
                    )}
                  </div>

                  <SectionHeader title="Orderer resources" />
                  <div className="space-y-8 ">
                    <ResourcesField
                      name="resources.Orderer"
                      register={methods.register}
                    />
                  </div>

                  <SectionHeader title="CouchDB" />
                  <div className="space-y-8 ">
                    <div className="grid grid-cols-1 sm:grid-cols-2 space-y-4 sm:space-y-0 sm:space-x-4 ">
                      <TextField
                        name="couchdb.image"
                        label="Image"
                        register={methods.register}
                      />
                      <TextField
                        name="couchdb.version"
                        label="Tag"
                        register={methods.register}
                      />
                    </div>
                    <TextField
                      name="couchdb.imagePullPolicy"
                      label="Image pull policy"
                      register={methods.register}
                    />
                    <TextField
                      name="couchdb.user"
                      label="User"
                      register={methods.register}
                    />
                    <TextField
                      name="couchdb.password"
                      label="Password"
                      register={methods.register}
                    />
                    <ResourcesField
                      name="resources.couchdb"
                      register={methods.register}
                    />
                  </div>
                  <SectionHeader title="Kubernetes chaincode builder" />
                  <div className="space-y-8 ">
                    <ToggleField
                      label="Enable Kubernetes Chaincode builder"
                      name="k8sChaincodeBuilder.enabled"
                      register={methods.register}
                    />
                  </div>
                  <SectionHeader title="Monitoring" />
                  <div className="space-y-8 ">
                    <ToggleField
                      label="Enabled"
                      name="serviceMonitor.enabled"
                      register={methods.register}
                      description={
                        <p>
                          Requires Kube prometheus stack installed, you can
                          check how to install{" "}
                          <a
                            className="text-gray-900 font-medium hover:text-gray-600"
                            href="https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack"
                            target="_blank"
                          >
                            it with Helm in Github
                          </a>
                        </p>
                      }
                    />
                    {watch("serviceMonitor.enabled") && (
                      <>
                        <TextField
                          label="Interval"
                          name="serviceMonitor.interval"
                          register={methods.register}
                        />
                        <TextField
                          label="Scrape timeout"
                          name="serviceMonitor.scrapeTimeout"
                          register={methods.register}
                        />
                        <TextField
                          label="Sample limit"
                          type="number"
                          name="serviceMonitor.sampleLimit"
                          register={methods.register}
                        />
                      </>
                    )}
                  </div>
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <SubmitButton
                        loading={createOrdererData.loading}
                        disabled={createOrdererData.loading}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Create
                      </SubmitButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
