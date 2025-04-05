import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  InputBase,
  Avatar,
  Divider,
  Breadcrumbs,
  ButtonBase,
  Button,
  Dialog,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useEffect, useState } from "react";
import {
  createAvatarLink,
  dismissToast,
  extractComponents,
  hashWordWithoutPublicSalt,
  IndexCategory,
  showError,
  showLoading,
  Spacer,
  useGlobal,
  usePublish,
} from "qapp-core";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const Search = () => {
  const openPageIndexManager = useGlobal().indexOperations.openPageIndexManager;
  const [searchParams] = useSearchParams();
  const publish = usePublish();
  const query = searchParams.get("q") || "";
  const [tab, setTab] = useState(0);
  const [results, setResults] = useState([]);
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(search.trim().toLocaleLowerCase())}`
      );
    }
  };

  const searchQortal = useCallback(async (searchQuery: string) => {
    const loadId = showLoading("Loading...");
    try {
      setResults([]);
      const res = await fetch(`/arbitrary/indices?terms=${searchQuery.trim()}`);
      const data = await res.json();
      const allResults = data.map(async (item) => {
        const identifierWithoutHash = item.name + item.link;
        const identifier = await hashWordWithoutPublicSalt(
          identifierWithoutHash,
          20
        );
        const rawData = await publish.fetchPublish(
          {
            name: item.name,
            service: "METADATA",
            identifier,
          },
          "JSON"
        );
        let copyItem = { ...item };
        if (
          rawData?.resource &&
          rawData?.resource?.data?.title &&
          rawData?.resource?.data?.description
        ) {
          copyItem = {
            ...copyItem,
            title: rawData?.resource?.data?.title,
            description: rawData?.resource?.data?.description,
          };
        }
        return copyItem;
      });
      const responseFromPromise = await Promise.all(allResults);
      setResults(responseFromPromise);
    } catch (error) {
      showError(error?.message || "Failed to fetch results");
    } finally {
      dismissToast(loadId);
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      searchQortal(query.trim());
    }
  }, [searchQortal, query]);

  return (
    <Box
      sx={{
        width: "100%",
        padding: '10px'
      }}
    >
      {/* Top search bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #dfe1e5",
          borderRadius: "24px",
          maxWidth: 600,
          mx: "auto",
          px: 2,
          py: 1,
          mb: 3,
        }}
      >
        <SearchIcon sx={{ color: "#9aa0a6" }} />
        <InputBase
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search?.trim()) {
              handleSearch();
            }
          }}
          placeholder="Search Qortal"
          value={search}
          fullWidth
          defaultValue={query}
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {/* <Tab  label="All" /> */}
        {/* <Tab disabled={true} label="Videos" />
        <Tab disabled={true} label="Images" />
        <Tab disabled={true} label="PDFs" />
        <Tab disabled={true} label="Audio" /> */}
      </Tabs>

      {/* Content */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Showing{" "}
          {
            [
              "all results",
              "video results",
              "image results",
              "pdf results",
              "audio results",
            ][tab]
          }{" "}
          for:
        </Typography>
        <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
          "{query}"
        </Typography>
        {/* You can replace this with dynamic results per tab */}
      </Box>
      <Spacer height="25px" />
      {results?.length === 0 && (
        <Typography variant="h6">No results</Typography>
      )}
      {results?.map((item, i) => {
        const res = extractComponents(item?.link || "");
        const appName = res?.name || "";

        return (
          <Box key={i} sx={{ mb: 3, display: "flex", gap: 2, width: "100%" }}>
            <Avatar
              alt={appName}
              src={createAvatarLink(appName)}
              variant="square"
              sx={{ width: 24, height: 24, mt: 0.5 }}
            />
            <Box
              sx={{
                width: "calc(100% - 50px)",
              }}
            >
              <ButtonBase
                sx={{
                  width: "100%",
                  justifyContent: 'flex-start'
                }}
                onClick={() => {
                  qortalRequest({
                    action: "OPEN_NEW_TAB",
                    qortalLink: item?.link,
                  });
                }}
              >
                <Breadcrumbs
                  separator={<NavigateNextIcon fontSize="small" />}
                  aria-label="breadcrumb"
                >
                  <Typography variant="body2" color="text.secondary">
                    {res?.service}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "start",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {appName}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "start",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {res?.path}
                  </Typography>
                </Breadcrumbs>
              </ButtonBase>
              <Spacer height="10px" />
              <ButtonBase
                sx={{
                  width: "100%",
                }}
                onClick={() => {
                  qortalRequest({
                    action: "OPEN_NEW_TAB",
                    qortalLink: item?.link,
                  });
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    width: "100%",
                    textAlign: "start",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {item?.title}
                </Typography>
              </ButtonBase>
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                variant="body2"
                color="text.secondary"
              >
                {item?.description}
              </Typography>
              <Button
                onClick={() => {
                  openPageIndexManager({
                    link: item.link,
                    name: item.name,
                    category: IndexCategory.PUBLIC_PAGE_VIDEO,
                    rootName: appName,
                  });
                }}
              >
                Index
              </Button>
              <Divider sx={{ mt: 2 }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
