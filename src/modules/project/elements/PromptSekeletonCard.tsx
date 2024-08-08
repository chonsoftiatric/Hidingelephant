import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BorderBeam } from "@/components/magic-ui/border-beam";
import { usePromptStore } from "@/store/prompt-settings";
import PromptInfo from "@/components/elements/PromptInfo";
import { IPromptSettingStore } from "@/types/prompt-settings";

const placeholders = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAABxXRFWHRwYXJhbWV0ZXJzAFByb2Zlc3Npb25hbCBsb2dvIGRlc2lnbi4gZG9nIHdlYXJpbmcgZ2xhc3NlcyA8bG9yYTpFbGVwaGFudF9MMToxPgpOZWdhdGl2ZSBwcm9tcHQ6ICBSZWFsaXN0aWMsIDNELCBwaG90b2dyYXBoeSwgYnVzaW5lc3MgY2FyZCwgcmVhbCBsaWZlLCBpbWFnZSwgcGljdHVyZSwgbG93IHF1YWxpdHksIHdhdGVybWFyaywgYmx1cnJ5LCBkZWZvcm1lZCwgZGVwdGggb2YgZmllbGQsIDNEIHJlbmRlciwga25vd24gYnJhbmRzLCBmYW1vdXMgYnJhbmRzLCBsYW5kc2NhcGUsIHBvcnRyYWl0LCBwaG90b3JlYWxpc20KU3RlcHM6IDMwLCBTYW1wbGVyOiBERElNLCBDRkcgc2NhbGU6IDcuMCwgU2VlZDogNDA4MDAxNzgxMywgU2l6ZTogNTEyeDUxMiwgTW9kZWwgaGFzaDogODg0MGUyZThlZiwgTW9kZWw6IGVsZXBoYW50djEsIERlbm9pc2luZyBzdHJlbmd0aDogMCwgVmVyc2lvbjogMS42LjBF5xOvAAAAPUlEQVR4nGO4fvZItpdGZYjWtZMHGGrjPWOtRWIs+Yuj3BiaG+r1GRisuBn6+3oZ3n/50poaPbU088efvwAezxZE1e6h4wAAAABJRU5ErkJggg==",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsXRFWHRwYXJhbWV0ZXJzAFByb2Zlc3Npb25hbCBsb2dvIGRlc2lnbi4gZG9nIHdlYXJpbmcgZ2xhc3NlcyAgCk5lZ2F0aXZlIHByb21wdDogIFJlYWxpc3RpYywgM0QsIHBob3RvZ3JhcGh5LCBidXNpbmVzcyBjYXJkLCByZWFsIGxpZmUsIGltYWdlLCBwaWN0dXJlLCBsb3cgcXVhbGl0eSwgd2F0ZXJtYXJrLCBibHVycnksIGRlZm9ybWVkLCBkZXB0aCBvZiBmaWVsZCwgM0QgcmVuZGVyLCBrbm93biBicmFuZHMsIGZhbW91cyBicmFuZHMsIGxhbmRzY2FwZSwgcG9ydHJhaXQsIHBob3RvcmVhbGlzbQpTdGVwczogNTAsIFNhbXBsZXI6IERESU0sIENGRyBzY2FsZTogNy4wLCBTZWVkOiAxNjc5NDYwNTgsIFNpemU6IDUxMng1MTIsIE1vZGVsIGhhc2g6IDg4NDBlMmU4ZWYsIE1vZGVsOiBlbGVwaGFudHYxLCBEZW5vaXNpbmcgc3RyZW5ndGg6IDAsIFZlcnNpb246IDEuNi4wqIutxwAAAD1JREFUeJxjYGAwVpeUUBUTZeCyYJjSv7wrw2F2eWhdxVSG7x//90bLNwYqnD71mkFdyTrOSSTXV1BL3hgAl3oQ69aEonkAAAAASUVORK5CYII=",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB5XRFWHRwYXJhbWV0ZXJzAFByb2Zlc3Npb25hbCBsb2dvIGRlc2lnbi4gZG9nIHdlYXJpbmcgZ2xhc3NlcyA8bG9yYTpFbGVwaGFudF9MMToxPgpOZWdhdGl2ZSBwcm9tcHQ6ICBSZWFsaXN0aWMsIDNELCBwaG90b2dyYXBoeSwgYnVzaW5lc3MgY2FyZCwgcmVhbCBsaWZlLCBpbWFnZSwgcGljdHVyZSwgbG93IHF1YWxpdHksIHdhdGVybWFyaywgYmx1cnJ5LCBkZWZvcm1lZCwgZGVwdGggb2YgZmllbGQsIDNEIHJlbmRlciwga25vd24gYnJhbmRzLCBmYW1vdXMgYnJhbmRzLCBsYW5kc2NhcGUsIHBvcnRyYWl0LCBwaG90b3JlYWxpc20KU3RlcHM6IDMwLCBTYW1wbGVyOiBERElNLCBDRkcgc2NhbGU6IDcuMCwgU2VlZDogMTAwMSwgU2l6ZTogNTEyeDUxMiwgTW9kZWwgaGFzaDogZmQ5Y2RjMjZjMywgTW9kZWw6IGR5bmF2aXNpb25YTEFsbEluT25lU3R5bGl6ZWRfcmVsZWFzZTA1NTdCYWtlZHZhZSwgRGVub2lzaW5nIHN0cmVuZ3RoOiAwLCBWZXJzaW9uOiAxLjYuMPzcZXQAAAA/SURBVHicATQAy/8A+OHLalNHaVJG+OHLAGFLPzQUACwAAFpBNgBcQz1RMig4GRBaQTwA89vI//Xs8ODY8trIEoUW7wzFKIgAAAAASUVORK5CYII=",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkHRFWHRSYXcACklQVEMgcHJvZmlsZQogICAgICA1OAozODQyNDk0ZDA0MDQwMDAwMDAwMDAwMTExYzAyNmUwMDBjNDE0OTIwNDc2NTZlNjU3MjYxNzQ2NTY0MDAzODQyNDk0ZDA0MjUwMDAwMDAwMDAwMTBmYTYyOGMyNDE4ODI3YmNmOGJmZDc3NjhhMzVhYmEwZgrzI8Y/AAAAP0lEQVR4nAE0AMv/AN/axP/96a2nlpWOegDSy7RtalomIhiMhXIAwLiidG9gQTwwdm9fAERANDw3KQcAABYQAMnxFR65/5K6AAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkHRFWHRSYXcACklQVEMgcHJvZmlsZQogICAgICA1OAozODQyNDk0ZDA0MDQwMDAwMDAwMDAwMTExYzAyNmUwMDBjNDE0OTIwNDc2NTZlNjU3MjYxNzQ2NTY0MDAzODQyNDk0ZDA0MjUwMDAwMDAwMDAwMTBmYTYyOGMyNDE4ODI3YmNmOGJmZDc3NjhhMzVhYmEwZgrzI8Y/AAAAP0lEQVR4nAE0AMv/AOXizf/83cvBp7evlwDc3ceAemYnJxt8fG0A1ceimpB2AAYAW1ZBAHNPJlpFHRoSAEUwBvJ+Fmw4BYjsAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkHRFWHRSYXcACklQVEMgcHJvZmlsZQogICAgICA1OAozODQyNDk0ZDA0MDQwMDAwMDAwMDAwMTExYzAyNmUwMDBjNDE0OTIwNDc2NTZlNjU3MjYxNzQ2NTY0MDAzODQyNDk0ZDA0MjUwMDAwMDAwMDAwMTBmYTYyOGMyNDE4ODI3YmNmOGJmZDc3NjhhMzVhYmEwZgrzI8Y/AAAAP0lEQVR4nAE0AMv/AMLLhrSleaqXa6OhagDT35t6a09RPTOFdk4A8P+5jZRtJR4TXUkoAMHShUVJKxECAF5AIpmDFcmVicu3AAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkHRFWHRSYXcACklQVEMgcHJvZmlsZQogICAgICA1OAozODQyNDk0ZDA0MDQwMDAwMDAwMDAwMTExYzAyNmUwMDBjNDE0OTIwNDc2NTZlNjU3MjYxNzQ2NTY0MDAzODQyNDk0ZDA0MjUwMDAwMDAwMDAwMTBmYTYyOGMyNDE4ODI3YmNmOGJmZDc3NjhhMzVhYmEwZgrzI8Y/AAAAPUlEQVR4nGOwMVP9/3Dnwo4cNSUxhspUz//fjpsr8YpxMTD4uBjP6ClTUxLXVJViMNVXyk30iwmwV5IRBADagQ+NG/35KAAAAABJRU5ErkJggg==",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAkHRFWHRSYXcACklQVEMgcHJvZmlsZQogICAgICA1OAozODQyNDk0ZDA0MDQwMDAwMDAwMDAwMTExYzAyNmUwMDBjNDE0OTIwNDc2NTZlNjU3MjYxNzQ2NTY0MDAzODQyNDk0ZDA0MjUwMDAwMDAwMDAwMTBmYTYyOGMyNDE4ODI3YmNmOGJmZDc3NjhhMzVhYmEwZgrzI8Y/AAAAP0lEQVR4nAE0AMv/AMvKwv/33+fHp6mhlQDAo4e9l3KBXTmAZk8A//POhn5tNTAgf25aANSqiUxMQQAIAWhSORLyGTab2kJhAAAAAElFTkSuQmCC",
];

interface BlurHashLoaderProps {
  placeholderSequence: string[];
}

const BlurHashLoader = ({ placeholderSequence }: BlurHashLoaderProps) => {
  const duration = (placeholders.length + 2) * 1000;
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        Math.floor(Math.random() * (placeholderSequence.length - 1))
      );
    }, duration / placeholderSequence.length);

    return () => clearInterval(interval);
  }, [placeholderSequence, duration]);

  return (
    <div className="relative h-full w-full rounded-xl">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentPlaceholderIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          className="rounded-xl"
        >
          <Image
            src={placeholderSequence[currentPlaceholderIndex]}
            alt="Loading..."
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            className="rounded-xl blur-[1px]"
            blurDataURL={placeholderSequence[currentPlaceholderIndex]}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface PromptSkeletonCardProps {
  imagesCount: number;
  withAnimation?: boolean;
  modelsObj: Record<string, string>;
  methodsObj: Record<string, string>;
  store: IPromptSettingStore;
}

const PromptSkeletonCard = ({
  imagesCount = 3,
  withAnimation = false,
  methodsObj,
  modelsObj,
  store,
}: PromptSkeletonCardProps) => {
  return (
    <div>
      {withAnimation ? (
        <PromptInfo
          isImg2Img={false}
          isMagic={false}
          // @ts-ignore
          prompt={{
            apiName: store.elephantBrain,
            prompt: store.prompt,
            negativePrompt: store.negativePrompt,
            original_seed: store.seed,
            samplerIndex: store.elephantModel,
            steps: store.quality,
            cfgScale: store.cfg,
            batchSize: store.numberOfImages,
          }}
          methodsObj={methodsObj}
          modelsObj={modelsObj}
        />
      ) : (
        <div className="border-[1px] rounded-[16px] p-4 border-[#D7D7D7] flex justify-between items-center gap-4">
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 prompt-list gap-6 mt-6">
        {Array.from({ length: imagesCount })?.map((_, index) => (
          <div
            key={"skeleton-image" + index}
            className="mx-auto relative rounded-xl group w-full h-full min-h-[276px] overflow-hidden"
          >
            {placeholders.length > 0 && withAnimation ? (
              <>
                <BlurHashLoader placeholderSequence={placeholders} />
                <BorderBeam borderWidth={2} size={250} duration={7} delay={5} />
              </>
            ) : (
              <Skeleton className="h-[276px] w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptSkeletonCard;
