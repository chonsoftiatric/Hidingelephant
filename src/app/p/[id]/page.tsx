"use client";
import React from "react";

import ProjectListView from "@/modules/project/views/ProjectListView";
import PromptBar from "@/modules/project/elements/PromptBar";
import { motion } from "framer-motion";
import LogoMakerLayout from "@/components/layout/LogoMaker/Layout";
import { useMyProjects } from "@/services/project.service";
import { useParams, useRouter } from "next/navigation";

export const maxDuration = 300; // Applies to the actions

const ProjectPage = () => {
  const { replace } = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useMyProjects();

  React.useEffect(() => {
    if (data && !data.length) {
      replace("/p/playground");
    } else if (data?.length && id !== "playground") {
      // @temp - redirecting to sub project id
      const project = data.find((p) => p.subProjects[0].id === +id);
      if (project?.type === "PLAYGROUND") {
        replace(`/p/playground`);
      } else if (!project) {
        replace(`/p/playground`);
      }
    }
  }, [id, data]);
  return (
    <LogoMakerLayout>
      <ProjectListView isLoading={isLoading} />
      <motion.div>
        <PromptBar />
      </motion.div>
    </LogoMakerLayout>
  );
};

export default ProjectPage;
