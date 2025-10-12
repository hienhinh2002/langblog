import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import LinkForm from "../components/LinkForm";

export default function EditLink() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get(`/links/${id}`)
      .then((res) => setInitial(res.data))
      .catch(() => setErr("Không tải được link."));
  }, [id]);

  if (err) return <div className="card text-red-600">{err}</div>;
  if (!initial) return <div className="card">Đang tải…</div>;

  return <LinkForm initial={initial} idForEdit={id} />;
}
