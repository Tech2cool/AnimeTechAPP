import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const BASE_URL = "https://gogo-server.vercel.app";

const fetchSources = async (episodeId) => {
  try {
    const result = await axios.get(`${BASE_URL}/source?episodeID=/${encodeURIComponent(episodeId)}`, { timeout: 5000 })
    // console.log({ result_data_1: "result.data 1" }, result.data);
    //   setvideoSrc(result.data.sources);
    return result.data.sources
  } catch (error) {
    return error
  }
}
const fetchLatestAnime = async (pageNum = 1, perPage = 12) => {
  try {
    const result = await axios.get(`${BASE_URL}/recent?page=${pageNum}&perPage=${perPage}`);
    // console.log({result:"result 1"},result.data);
    return result.data
  } catch (error) {
    return error
  }
}
const fetchAnimeByGenre = async (genre, page=1) => {
  try {
    const result = await axios.get(`${BASE_URL}/genre/${genre}/${page}`);
    // console.log({result:"result 1"},result.data);
    return result.data
  } catch (error) {
    return error
  }
}
const fetchAnimeMovies = async (alphabet="",page=1) => {
  try {
    const result = await axios.get(`${BASE_URL}/movies?alphabet=${alphabet}&page=${page}`);
    // console.log({result:"result 1"},result.data);
    return result.data
  } catch (error) {
    return error
  }
}
const fetchTopAiringAnime = async (page=1) => {
  try {
    const result = await axios.get(`${BASE_URL}/top-airing?page=${page}`);
    // console.log({result:"result 1"},result.data);
    return result.data
  } catch (error) {
    return error
  }
}


const fetchAnimeBySearch = async (sTitle, sPage) => {
  try {
    const result = await axios.get(`${BASE_URL}/search?title=${encodeURIComponent(sTitle)}&page=${sPage}`)
    // console.log({result1_Data:"result1_Data"}, result.data);
    return result.data
  } catch (error) {
    return error
    console.log(error);
  }
}
const fetchAnimeInfo = async (animeId) => {
  try {
    const result = await axios.get(`${BASE_URL}/anime-details?animeID=${encodeURIComponent(animeId)}`)
    // console.log({result1_Data:"result1_Data"}, result.data);
    return result.data
  } catch (error) {
    return error
    console.log(error);
  }
}
const fetchPopularAnime = async (page) => {
  try {
    const result = await axios.get(`${BASE_URL}/popular?page=${page}`)
    // console.log({result1_Data:"result1_Data"}, result.data);
    return result.data
  } catch (error) {
    return error
    console.log(error);
  }
}
const fetchEpisodeDetailsFromKitsu = async (kId, EpNum) => {
  try {
    // kid?KitsuId=44172&episode=37
    const result = await axios.get(`${BASE_URL}/kid?KitsuId=${kId}&episode=${EpNum}`)
    // console.log({result1_Data:"kistu_Data"}, result.data);
    return result.data
  } catch (error) {
    return error
    console.log(error);
  }
}
const fetchEpisodes = async (animeId, kId) => {
  try {
    // kid?KitsuId=44172&episode=37
    const result = await axios.get(`${BASE_URL}/episodes?animeID=${encodeURIComponent(animeId)}&kid=${kId}`)
    // console.log({result1_Data:"kistu_Data"}, result.data);
    return result.data
  } catch (error) {
    console.log(error);
    return error
  }
}

const storeAsynStorageData = async (myKey, inputData) => {
  try {
    // const stringifiedData = JSON.stringify(inputData);
    await AsyncStorage.setItem(myKey, inputData);
    // console.log('Data stored successfully!');
  } catch (error) {
    return { message: error }
  }
};

const getAsynStorageData = async (myKey) => {
  try {
    const value = await AsyncStorage.getItem(myKey);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    return { message: error };
  }
};
const getAllAsynStorageData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    // Retrieve the values for the filtered keys
    const allAsyncData = await AsyncStorage.multiGet(allKeys);

    // Parse the values from JSON
    //   console.log(allAsyncData)
    return allAsyncData.map(([key, value]) => ({ key: key, value: value }));

  } catch (error) {
    console.error('Error retrieving watched episodes:', error);
    return [];
  }
};
function filterNUE(data){
  if(data === null || data=== undefined || data === "" || data === "undefined" || data === "null")
  return false
  else return true
}
const getQueryParams = (url) => {
  const queryParams = {};
  const queryString = url.split('?')[1];

  if (queryString) {
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      queryParams[key] = value;
    });
  }

  return queryParams;
};
const BASE_SHARE_URL ="https://animetechapp.page.link";
async function buildLink(key, data, Title="", posterUrl="", customMessege="") {
  console.log(customMessege)
  const link = await dynamicLinks().buildLink({
    link: `${BASE_SHARE_URL}/${key}?${data}`,
    domainUriPrefix: BASE_SHARE_URL,
    android:{
      packageName:"com.animetech",
      imageUrl: posterUrl,
    },
    social: {
      title: Title,
      description: customMessege, // Set your message
      imageUrl:posterUrl,
    },

    // analytics: {
    //   campaign: 'banner',
    // },
  }, dynamicLinks.ShortLinkType.SHORT);
  // console.log(link)
  // setMyLink(link)
  return link;
}
const generateDynamicLink = (episodeId, episodeNum, animeId) => {
  const baseLink = 'https://gogo-server.vercel.app/video';
  const encodedLink = `${baseLink}?episodeId=${encodeURIComponent(episodeId)}&episodeNum=${encodeURIComponent(episodeNum)}&animeId=${encodeURIComponent(animeId)}`;
  return encodedLink;
};

export {
  fetchSources, getAsynStorageData, storeAsynStorageData, fetchLatestAnime,
  fetchAnimeBySearch, fetchEpisodeDetailsFromKitsu, fetchEpisodes, fetchAnimeInfo,
  fetchPopularAnime, getAllAsynStorageData,filterNUE,fetchAnimeByGenre,fetchAnimeMovies,
  fetchTopAiringAnime,getQueryParams,buildLink,generateDynamicLink
}