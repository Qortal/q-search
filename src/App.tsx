import { Box,  Typography, Button, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
 
function App() {

const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
const navigate = useNavigate();

const handleSearch = () => {
  if (search.trim()) {
    navigate(`/search?q=${encodeURIComponent(search.trim().toLocaleLowerCase())}`);
  }
};

useEffect(()=> {
  if(searchRef.current){
    searchRef.current.focus()
  }
}, [])
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // bgcolor: 'white',
      }}
    >
      {/* Logo */}
      <Typography variant="h2" sx={{ fontFamily: 'sans-serif', color: '#4285F4', fontWeight: 600 }}>
        Q-
        <span style={{ color: '#4285F4' }}>s</span>
        <span style={{ color: '#4285F4' }}>e</span>
        <span style={{ color: '#4285F4' }}>a</span>
        <span style={{ color: '#4285F4' }}>r</span>
        <span style={{ color: '#4285F4' }}>c</span>
        <span style={{ color: '#4285F4' }}>h</span>
      </Typography>

      {/* Search bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 4,
          width: '90%',
          maxWidth: 600,
          border: '1px solid #dfe1e5',
          borderRadius: '24px',
          px: 2,
          py: 1,
          boxShadow: 1,
        }}
      >
        <SearchIcon sx={{ color: '#9aa0a6' }} />
        <InputBase
        inputRef={searchRef}
          onChange={(e)=> setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && search?.trim()) {
            handleSearch()
          }
        }}
        value={search}
          fullWidth
          placeholder="Search Qortal"
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button onClick={handleSearch} variant="outlined">Qortal Search</Button>
      </Box>
    </Box>
  )
}

export default App
