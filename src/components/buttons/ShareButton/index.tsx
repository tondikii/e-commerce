"use client";

import {IconButton} from "@mui/joy";
import ShareRounded from "@mui/icons-material/ShareRounded";
import {useCallback} from "react";

export default function ShareButton() {
  const handleShare = useCallback(async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url,
        });
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("URL copied to clipboard!");
      } catch (err) {}
    }
  }, []);

  return (
    <IconButton
      variant="outlined"
      color="neutral"
      size="lg"
      onClick={handleShare}
    >
      <ShareRounded />
    </IconButton>
  );
}
