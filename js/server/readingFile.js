import { readdirSync, promises, statSync } from "fs";
import {
  formatsVideo,
  homeDirectory,
  videoDirectory,
  musicDirectory,
} from "./assets.js";
import { join } from "path";

export const getDeepFiles = (dir) => {
  const result = readdirSync(dir, {
    withFileTypes: true,
  }).flatMap((file) =>
    file.isDirectory()
      ? getDeepFiles(join(dir, file.name))
      : join(dir, file.name)
  );
  return result;
};

const sortingVideoByDateOfEditing = (path, videosArrayByYear, isVideo) => {
  const directory = isVideo ? videoDirectory : homeDirectory;
  return Object.fromEntries(
    Object.entries(videosArrayByYear).map(([key, value]) => {
      const newValue = value
        .map((fileName) => ({
          name: fileName,
          time: statSync(
            `${directory}${path}/${key}/${fileName}`
          ).birthtime,
        }))
        .sort((a, b) => b.time - a.time)
        .map((file) => file.name);
      return [key, newValue];
    })
  );
};

export const simpleReadFile = async (path) => {
  try {
    const file = await promises.readdir(path)
    return file.map((fileName) => ({
      name: fileName,
      time: statSync(
        `${path}/${fileName}`
      ).birthtime,
  }))
    .sort((a, b) => b.time - a.time)
    .map((file) => file.name);
  } catch (err) {
    console.error(err);
  }
};
export const readFile = (path) => {
  try {
    const allFiles = readdirSync(`${homeDirectory}${path}`);
    return allFiles;
  } catch (err) {
    console.error(err);
  }
};

export const getSortedFiles = async (
  path,
  isVideo = false,
  isMusic = false
) => {
  let directory = isVideo ? videoDirectory : homeDirectory;
  directory = isMusic ? musicDirectory : directory;

  const files = await promises.readdir(`${directory}${path}`, {
    recursive: true,
  });

  const result = files
    .map((fileName) => ({
      name: fileName,
      time: statSync(`${directory}${path}/${fileName}`).birthtime
    }))
    .sort((a, b) => b.time - a.time)
    .map((file) => file.name);

  if (!isVideo) return result;

  const filteredReseult = result.filter((fileName) => {
    const resolution = fileName.split(".")[fileName.split(".").length - 1];
    return formatsVideo.includes(resolution);
  });
  return filteredReseult;
};

export const getModifiedVideosByYear = async (path, isVideo = true) => {
  const videos = await getSortedFiles(path, isVideo);

  const modifiedVideos = videos
    .map((el) => {
      const [year, nameOfVideo] = el.split("\\");

      return [year, nameOfVideo];
    })
    .filter(([year, names]) => !!names)
    .reduce((summ, [year, names]) => {
      if (!summ.hasOwnProperty(year)) {
        return { ...summ, [year]: [names] };
      } else {
        summ[year] = [...summ[year], names];
        return summ;
      }
    }, {});

  const result = sortingVideoByDateOfEditing(path, modifiedVideos, isVideo);
  return result;
};

export const getFromLiveFiles = (dir) => {
  const result = getDeepFiles(dir);
  const result1 = result.reduce((accum, el) => {
    const [year, event, ...files] = el.split("\\").slice(2);
    const modifiedFile = files.join().split(".");
    const isNotDesctionAndIsTxt =
      modifiedFile[1] == "txt" && modifiedFile[0] !== "description";
    if (isNotDesctionAndIsTxt) {
      return accum;
    }

    if (!accum.hasOwnProperty(year)) {
      return { ...accum, [year]: { [event]: [...files] } };
    } else {
      if (!accum[year].hasOwnProperty(event)) {
        return {
          ...accum,
          [year]: {
            ...accum[year],
            [event]: [...files],
          },
        };
      } else {
        return {
          ...accum,
          [year]: {
            ...accum[year],
            [event]: [...accum[year][event], ...files],
          },
        };
      }
    }
  }, {});
  return result1;
};
