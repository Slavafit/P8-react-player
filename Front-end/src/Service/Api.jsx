import axios from "axios";

export async function fetchData(url) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Request failed with status:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function fetchLists() {
  return fetchData("http://localhost:5000/lists");
}

export async function fetchSongs() {
  return fetchData("http://localhost:5000/songs");
}
