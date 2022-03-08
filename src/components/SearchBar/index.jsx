import { TextInput } from 'grommet';
import { Search } from 'grommet-icons';

// TO COMPLETE
const SearchBar = () => {
  return (
    <TextInput 
      icon={<Search />} 
      placeholder="Search..." 
      size="medium" 
      textAlign="start" 
      type="text" 
      reverse 
    />
  )
}

export default SearchBar