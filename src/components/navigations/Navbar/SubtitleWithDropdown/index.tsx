// src/components/navigations/Navbar/SubtitleWithDropdown.tsx
"use client";

import {useState, useRef, useEffect} from "react";
import {Box, Sheet, Typography, List, ListItem, ListItemButton} from "@mui/joy";
import {ExpandMoreRounded} from "@mui/icons-material";
import type {FC} from "react";

interface DropdownItem {
  name: string;
}

interface SubtitleWithDropdownProps {
  title: string;
  items: DropdownItem[];
  sx?: any;
}

const SubtitleWithDropdown: FC<SubtitleWithDropdownProps> = ({
  title,
  items,
  sx,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    // Navigate to the appropriate link
    // if (item.href) {
    //   window.location.href = item.href;
    // }
    setIsOpen(false);
  };

  return (
    <Box
      ref={dropdownRef}
      sx={{
        position: "relative",
        display: "inline-block",
        ...sx,
      }}
    >
      <Typography
        level="body-md"
        sx={{
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          "&:hover": {
            color: "primary.plainColor",
          },
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ExpandMoreRounded
          sx={{
            fontSize: "1rem",
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s ease",
          }}
        />
      </Typography>

      {isOpen && (
        <Sheet
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            mt: 1,
            minWidth: 200,
            bgcolor: "background.surface",
            borderRadius: "md",
            boxShadow: "md",
            border: "1px solid",
            borderColor: "divider",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <List
            size="sm"
            sx={{
              py: 0.5,
            }}
          >
            {items.map((item, index) => (
              <ListItem key={index} sx={{p: 0}}>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  sx={{
                    px: 2,
                    py: 1,
                    "&:hover": {
                      bgcolor: "primary.softBg",
                    },
                  }}
                >
                  {item.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Sheet>
      )}
    </Box>
  );
};

export default SubtitleWithDropdown;
