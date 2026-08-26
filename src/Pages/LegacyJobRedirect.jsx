import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJobRecord, resolveRedirectSlug } from "../utils/jobRoutes";
import { buildJobCanonicalPath, getJobRecordId } from "../utils/seo";

function LegacyJobRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/jobs", { replace: true });
      return;
    }

    const redirect = async () => {
      try {
        const job = await fetchJobRecord(id);

        if (job?.redirect) {
          const newSlug =
            resolveRedirectSlug(job.location || job.slug) || job.slug;
          if (newSlug) {
            navigate(`/job/${newSlug}`, { replace: true });
            return;
          }
          navigate("/jobs", { replace: true });
          return;
        }

        const path = buildJobCanonicalPath(job);
        if (!path) {
          navigate("/jobs", { replace: true });
          return;
        }

        navigate(path, {
          replace: true,
          state: {
            JobId: getJobRecordId(job),
            from: "/jobs",
          },
        });
      } catch {
        navigate("/jobs", { replace: true });
      }
    };

    redirect();
  }, [id, navigate]);

  return null;
}

export default LegacyJobRedirect;
