import { TextInput } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

// TO COMPLETE
const SearchBar = () => {
  return (
    <TextInput 
      icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} 
      placeholder="Search..." 
      size="medium" 
      textAlign="start" 
      type="text" 
      reverse 
    />
  )
}

export default SearchBar