import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
import { FFmpegKit, FFmpegKitConfig, FFprobeKit, ReturnCode } from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "https://gogo-server.vercel.app";
const BASE_SHARE_URL = "https://animetechapp.page.link";

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
const fetchAnimeByGenre = async (genre, page = 1) => {
  try {
    const result = await axios.get(`${BASE_URL}/genre/${genre}/${page}`);
    // console.log({result:"result 1"},result.data);
    return result.data
  } catch (error) {
    return error
  }
}
const fetchAnimeMovies = async (alphabet = "", page = 1) => {
  try {
    const result = await axios.get(`${BASE_URL}/movies?alphabet=${alphabet}&page=${page}`);
    // console.log({result:"result 1"},result.data);
    return result.data
  } catch (error) {
    return error
  }
}
const fetchTopAiringAnime = async (page = 1) => {
  try {
    const result = await axios.get(`${BASE_URL}/top-airing?page=${page}`);
    // console.log({result:"result 1"},result.data);
    return result.data
  } catch (error) {
    return error
  }
}

const fetchAnimeBySearch = async (sTitle, sPage, genre, status,subtype, type, season, year) => {
  try {
      // const subtype2 = subtype === "All"?"":subtype
      // const status2 = status === "All"?"":status
      // const url = `${BASE_URL}/search?title=${encodeURIComponent(sTitle)}\
      // &page=${sPage}&genre=${encodeURIComponent(genre)}\
      // &status=${status2}&subtype=${subtype2}&type=${type}\
      // &season=${season}&year=${year}`;
      let url =`${BASE_URL}/search?title=${encodeURIComponent(sTitle)}&page=${sPage}`
      if(isValidData(genre)){
        url += `&genre=${encodeURIComponent(genre)}`
      }
      if(isValidData(status)){
        url += `&status=${status}`
      }
      if(isValidData(subtype)){
        url += `&subtype=${subtype}`
      }
      if(isValidData(type)){
        url += `&type=${type}`
      }
      if(isValidData(season)){
        url += `&season=${season}`
      }
      if(isValidData(year)){
        url += `&year=${encodeURIComponent(year)}`
      }
      

      // console.log(testURL)
      const result = await axios.get(url)
      // console.log({result1_Data:"result1_Data"}, result.data);
              // const result = await searchh(title, page, genre, status,subtype, type, season, year)

      return result.data
  } catch (error) {
    // console.log(error);
    return error
  }
}

const fetchAnimeInfo = async (animeId) => {
  try {
    const result = await axios.get(`${BASE_URL}/anime-details?animeID=${encodeURIComponent(animeId)}`)
    // console.log({result1_Data:"result1_Data"}, result.data);
    return result.data
  } catch (error) {
    // console.log(error);
    return error
  }
}

const fetchPopularAnime = async (page) => {
  try {
    const result = await axios.get(`${BASE_URL}/popular?page=${page}`)
    // console.log({result1_Data:"result1_Data"}, result.data);
    return result.data
  } catch (error) {
    // console.log(error);
    return error
  }
}

const fetchEpisodeDetailsFromKitsu = async (kId, EpNum) => {
  try {
    // kid?KitsuId=44172&episode=37
    const result = await axios.get(`${BASE_URL}/kid?KitsuId=${kId}&episode=${EpNum}`)
    // console.log({result1_Data:"kistu_Data"}, result.data);
    return result.data
  } catch (error) {
    // console.log(error);
    return error
  }
}

const fetchEpisodes = async (animeId, kId) => {
  try {
    // kid?KitsuId=44172&episode=37
    const result = await axios.get(`${BASE_URL}/episodes?animeID=${encodeURIComponent(animeId)}&kid=${kId}`)
    // console.log({result1_Data:"kistu_Data"}, result.data);
    return result.data
  } catch (error) {
    // console.log(error);
    return error
  }
}
const fetchScheduleWeekly = async () => {
  try {
    // kid?KitsuId=44172&episode=37
    const result = await axios.get(`${BASE_URL}/schedule-weekly`)
    //  console.log({result1_Data:"kistu_Data"}, result.data);
    return result.data
  } catch (error) {
    // console.log(error);
    return error
  }
}
const fetchScheduleToday = async (date) => {
  try {
    // kid?KitsuId=44172&episode=37
    const result = await axios.get(`${BASE_URL}/scheduleToday?date=${date}`)
    // console.log({result1_Data:"kistu_Data"}, result.data);
    return result.data
  } catch (error) {
    // console.log(error);
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
    // console.error('Error retrieving watched episodes:', error);
    return [];
  }
};
function isValidData(data) {
  if (data === null || data === undefined || data === "" || data === "undefined" || data === "null")
    return false
  else return true
}

const getQueryParams = (url) => {
  const queryParams = {};
  const queryString = url?.split('?')[1];

  if (queryString) {
    const pairs = queryString?.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair?.split('=');
      queryParams[key] = value;
    });
  }

  return queryParams;
};

async function buildLink(key, data, Title = "", posterUrl = "", customMessege = "") {
  // console.log(customMessege)
  // const link = await dynamicLinks().buildLink({
  //   link: `${BASE_SHARE_URL}/${key}?${data}`,
  //   domainUriPrefix: BASE_SHARE_URL,
  //   android: {
  //     packageName: "com.animetech",
  //     imageUrl: posterUrl,
  //   },
  //   social: {
  //     title: Title,
  //     description: customMessege, // Set your message
  //     imageUrl: posterUrl,
  //   },

  //   // analytics: {
  //   //   campaign: 'banner',
  //   // },
  // }, dynamicLinks.ShortLinkType.SHORT);
  // console.log(link)
  // setMyLink(link)
  // return link;
}
const generateDynamicLink = async (key, animeId, episodeId, episodeNum, imageUrl, title, description) => {
  // const baseLink = 'https://gogo-server.vercel.app/video';

  const share = 'share';
  const baseURI = "https://ani-short.vercel.app";
  const myUrl = `${baseURI}/${share}?key=${key}&animeId=${animeId}&episodeId=${episodeId}&episodeNum=${episodeNum}`;
  saveGeneratedLink(key, animeId, episodeId, episodeNum, imageUrl, title, description)
  return myUrl;
};

async function saveGeneratedLink(key, animeId, episodeId, episodeNum, imageUrl, title, description) {
  try {
    await axios.post(`https://ani-short.vercel.app/url`, {
      key,
      animeId: encodeURIComponent(animeId),
      episodeId: encodeURIComponent(episodeId),
      episodeNum: episodeNum,
      imageUrl: imageUrl,
      title: title,
      description: description,
    });
    // console.log("linked")
    // return req.data
  } catch (error) {
    // console.log(error)
    return error
  }
}
function setPagesArray(currentPage, totalPage) {

  if (totalPage > 8) {
    const pageArray2 = [1, 2, "..."]
    for (let i = currentPage; i <= totalPage; i++) {
      pageArray2.push(i)
    }
    return pageArray2
  }
  else {
    const pageArray = []
    for (let i = 1; i <= totalPage; i++) {
      pageArray.push(i)
    }
    return pageArray
  }
}

function convertToAMPM(timeString) {
  const [hours, minutes] = timeString.split(':');
  let convertedHours = parseInt(hours, 10) % 12;
  convertedHours = convertedHours === 0 ? 12 : convertedHours;
  const period = parseInt(hours, 10) < 12 ? 'AM' : 'PM';
  return `${convertedHours}:${minutes} ${period}`;
}
async function getHLSInfo(url) {
  try {
    // Fetch the .m3u8 playlist content
    const response = await fetch(url);
    const playlistContent = await response.text();

    // Split the playlist content into lines
    const lines = playlistContent.split('\n');

    // Initialize variables to store information
    let duration = null;
    let totalFrames = 0;

    // Iterate through the lines of the playlist
    for (const line of lines) {
      // Check for duration tag
      if (line.startsWith('#EXT-X-TARGETDURATION:')) {
        duration = parseFloat(line.split(':')[1]);
      }
      // Check for segment tags and count frames
      else if (line.startsWith('#EXTINF:')) {
        const segmentDuration = parseFloat(line.split(':')[1].split(',')[0]);
        totalFrames += segmentDuration;
      }
    }

    return { duration, totalFrames };
  } catch (error) {
    console.error('Error fetching or parsing HLS info:', error);
    return null;
  }
}
function calculatePercentageFromFrames(currentFrame, totalFrames) {
  if (totalFrames === 0) return 0; // Prevent division by zero
  const percentage = (currentFrame / totalFrames);
  return Math.min(100, percentage); // Ensure percentage doesn't exceed 100
}

const convertM3U8toMP4 = async (m3u8Url, item, quality, anime) => {
  const outputVideoName = item?.id
  const downloadDirectory = RNFS.DownloadDirectoryPath;
  const folderPath = `${downloadDirectory}/AnimeTech`;
  let duration, sessionId, sState, totalFrames;
  const outputFile = `file://${folderPath}/${outputVideoName}-${quality}.mp4`;
  const currentTime = new Date()
  try {
    // const navigation = useNavigation()
    // console.log(m3u8Url)
    // console.log(outputVideoName)
    console.log(outputVideoName)
    const existingFolder = await RNFS.exists(folderPath)
    if (!existingFolder) RNFS.mkdir(folderPath)
    const existingDownload = await RNFS.exists(`${folderPath}/${outputVideoName}-${quality}.mp4`)

    const obj = {
      url: outputFile,
      m3u8Url: m3u8Url,
      item: item,
      quality: quality,
      status: "downloading",
      anime: anime,
      sessionId: sessionId,
      sState: sState,
      progress: 0, // Add progress property
      currentTime: currentTime,
    }
    const obj2 = {
      url: outputFile,
      m3u8Url: m3u8Url,
      item: item,
      quality: quality,
      status: "downloaded",
      anime: anime,
      sessionId: sessionId,
      sState: sState,
      progress: 100,
      currentTime: currentTime,
    }
    const obj6 = {
      url: outputFile,
      m3u8Url: m3u8Url,
      item: item,
      quality: quality,
      status: "canceled",
      anime: anime,
      sessionId: sessionId,
      sState: sState,
      progress: 100,
      currentTime: currentTime,
    }
    if (existingDownload) {
      // console.log("exist")
      // await getAsynStorageData(`download_${outputVideoName}-${quality}`)
      storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj2))
      ToastAndroid.show("Download Restored", ToastAndroid.SHORT)
      // navigation.navigate("Downloads")
      ToastAndroid.show("Already Downloaded", ToastAndroid.SHORT)
      // navigation.navigate("Downloads")
      return ToastAndroid.show("Already Downloaded", ToastAndroid.SHORT)
    }
    // console.log("not exist")
    storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj))
    ToastAndroid.show("Download Started", ToastAndroid.SHORT)

    const command = `-i ${m3u8Url} -c copy -bsf:a aac_adtstoasc ${outputFile}`;

    await FFmpegKit.executeAsync(command, async session => {
      // sessionId = session.getSessionId();

      // sState = await session.getState();
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj2))
        ToastAndroid.show("download Completed", ToastAndroid.SHORT)
      }
      else if (ReturnCode.isCancel(returnCode)) {
        storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj6))
        ToastAndroid.show("download Completed", ToastAndroid.SHORT)
      }

    }, log => {
      const log_msg = log.getMessage()
      // console.log(log_msg);

      const not_Found = "undefined: No such file or directory"
      if (log_msg.includes(not_Found)) {
        const obj4 = {
          url: outputFile,
          m3u8Url: m3u8Url,
          item: item,
          quality: quality,
          status: "failed",
          anime: anime,
          sessionId: sessionId,
          sState: sState,
          progress: 100,
          currentTime: currentTime,
        }
        // storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj4))
        const deleteItem = async () => {
          await AsyncStorage.removeItem(`download_${outputVideoName}-${quality}`)
        }
        deleteItem()
        ToastAndroid.show("This quality Unavailable, try other Quality", ToastAndroid.SHORT)
      }
    },
      statistics => {
        if (statistics === undefined || statistics?.getTime() < 0) return;
        const currentFrame = statistics?.getVideoFrameNumber();
        const fps = statistics?.getVideoFps();
        let progg = currentFrame / fps?.toFixed(1)
        if (currentFrame / fps?.toFixed(1) >= 100) {
          progg = 98
        }

        const obj3 = {
          url: outputFile,
          m3u8Url: m3u8Url,
          item: item,
          quality: quality,
          status: "downloading",
          anime: anime,
          sessionId: sessionId,
          sState: sState,
          progress: progg,
          currentTime: currentTime,
        }
        storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj3))
      }).then(session => {
        // session.getDuration().then(d=>console.log("durrra: " + d))
        getHLSInfo(m3u8Url)
          .then((res) => {
            duration = res.duration
            totalFrames = res.totalFrames
            console.log(res)
          })
          .catch((err) => {
            ToastAndroid.show("This Quality Unavailable", ToastAndroid.SHORT)
          })

        sessionId = session.getSessionId();
        session.getState().then((res) => sState = res)
        storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj))
        console.log(`Async FFmpeg process started with sessionId ${session.getSessionId()}.`)
      })
  } catch (error) {
    const obj5 = {
      url: outputFile,
      m3u8Url: m3u8Url,
      item: item,
      quality: quality,
      status: "failed",
      anime: anime,
      sessionId: sessionId,
      sState: sState,
      progress: 100,
      currentTime: currentTime,
    }
    storeAsynStorageData(`download_${outputVideoName}-${quality}`, JSON.stringify(obj5))

    ToastAndroid.show("Error Occured", ToastAndroid.SHORT)
  }
};


// Sorting function based on the time property of the day objects
function compareTime(a, b) {
  const timeA = convertToAMPM(a.time);
  const timeB = convertToAMPM(b.time);
  return timeA.localeCompare(timeB);
}

export {
  fetchSources, getAsynStorageData, storeAsynStorageData, fetchLatestAnime,
  fetchAnimeBySearch, fetchEpisodeDetailsFromKitsu, fetchEpisodes, fetchAnimeInfo,
  fetchPopularAnime, getAllAsynStorageData, isValidData, fetchAnimeByGenre, fetchAnimeMovies,
  fetchTopAiringAnime, getQueryParams, buildLink, generateDynamicLink, setPagesArray, fetchScheduleToday,
  convertToAMPM, compareTime, fetchScheduleWeekly, convertM3U8toMP4
}