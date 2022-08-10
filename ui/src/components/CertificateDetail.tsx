import React, { useMemo, useState } from "react";
// @ts-ignore
import * as pkijs from "pkijs";
import { fromBER } from "asn1js";
import TimeAgo from "timeago-react";

import { Buffer } from "buffer";
function pemToAsn1(pemString: string) {
  const der = pemToDer(pemString);
  const asn1 = fromBER(der);
  if (asn1.offset === -1) {
    throw new Error("Value is not DER-encoded");
  }
  return asn1.result;
}

function pemToDer(pemString: string) {
  const derBase64 = pemString.replace(/(-----(BEGIN|END) [\w ]+-----|\n)/g, "");
  const der = Buffer.from(derBase64, "base64");
  return der.buffer.slice(der.byteOffset, der.byteOffset + der.byteLength);
}
interface CertificateDetailProps {
  certificate: string;
}
export default function CertificateDetail({
  certificate,
}: CertificateDetailProps) {
  const [error, setError] = useState<string>("");
  const recipientCertificate: any = useMemo(() => {
    try {
      const crt = new pkijs.Certificate({
        schema: pemToAsn1(certificate),
      });
      return crt;
    } catch (e) {
      setError((e as any).message);
      return null;
    }
  }, [certificate, setError]);

  return error ? (
    <p>{error}</p>
  ) : recipientCertificate ? (
    <div>
      <p>
        Expires{" "}
        <TimeAgo
          title={recipientCertificate.notAfter.value}
          datetime={recipientCertificate.notAfter.value}
        />
      </p>
      <pre className="select-all">{certificate}</pre>
    </div>
  ) : (
    <p>Failed to decode certificate: {certificate}</p>
  );
}
