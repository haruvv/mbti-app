import { useRouter } from 'next/router';

const SearchResults = () => {
  const router = useRouter();

  const handleUserClick = (user) => {
    const profilePath = `/profile/${user.handle || user.user_id}`;
    router.push(profilePath);
  };

  return (
    // Rest of the component code
  );
};

export default SearchResults; 