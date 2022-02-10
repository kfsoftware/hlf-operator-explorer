Form to create peer:
```text
- stateDb (couchDB/levelDB)
- CouchDB user/password (if present)
- Gossip properties
    + bootstrap
    + endpoint
    + externalEndpoint
    + orgLeader
    + useLeaderElection

- hosts(array)
- image
- tag
- imagePullPolicy

- istio(check)
    + hosts (array)
    + ingressGateway
    + port (number)

- logging(optional)

- mspID(string)
- replicas(1 number)
- resources
    + chaincode
    + couchdb(if present)
    + peer
    + couchdbexporter(if present)

- enrollment
    + component
        - cahost
        - caname
        - caport
        - catls -> cacert
        - enrollid
        - enrollsecret
    + tls
        - cahost
        - caname
        - caport
        - catls -> cacert
        - csr
            + hosts(array)
            + commonName
        - enrollid
        - enrollsecret


- serviceType (NodePort, ClusterIP, LoadBalancer)

- serviceMonitor (bool default false)
    + enabled
    + interval (string)
    + labels (key,value)
    + sampleLimit (number)
    + scrapeTimeout (string)

- storage:
    + peer
        - size
        - storageClass
        - accessMode
    + couchDB
        - size
        - storageClass
        - accessMode
    + chaincode
        - size
        - storageClass
        - accessMode


- updateCertificateTime

```