import { useState, useEffect } from "react";
import { Movie } from "../types";

import axios from "axios";
import { useParams } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams();
  const [mId, setMId] = useState<any>(null);
  const [movieDetailData, setMovieDetailData] = useState<Movie | null>();
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [streamPlatforms, setStreamPlatforms] = useState<string | null>(null);

  useEffect(() => {
    setMId(movieId);
  }, [movieId]);

  useEffect(() => {
    if (mId) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${mId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
          },
        })
        .then((res) => {
          if (res) {
            setDataLoading(false);
            // console.log(res.data);
            setMovieDetailData(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`https://api.themoviedb.org/3/movie/${mId}/watch/providers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
          },
        })
        .then((res) => {
          if (res) {
            if (res.data.results?.IN?.link) {
              setStreamPlatforms(res.data.results?.IN?.link);
            } else {
              setStreamPlatforms(null);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      setMovieDetailData(null);
    };
  }, [mId]);

  const redirectToPlatforms = () => {
    if (streamPlatforms) {
      window.open(streamPlatforms, "_blank");
    } else {
      alert("No Streaming Platforms Available");
    }
  };

  return (
    <>
      {dataLoading === false ? (
        <div className="h-screen w-screen  bg-[rgb(7,7,7)] overflow-x-hidden">
          <div
            className={`justify-center h-full object-cover bg-no-repeat bg-cover bg-center `}
            style={{
              backgroundImage: `url(${
                "https://image.tmdb.org/t/p/original" +
                (movieDetailData?.backdrop_path || movieDetailData?.poster_path)
              })`,
            }}
          >
            <div className="h-screen w-screen grid grid-cols-1 sm:grid-cols-2 place-items-center  backdrop-brightness-[0.25] bg-gradient-to-t from-black/50 to-black/0 font-[Poppins]">
              <div className="w-[50%] sm:w-[40%]">
                <div className="pt-20">
                  <LazyLoadImage
                    effect="blur"
                    className="w-[100%] h-full object-fill rounded-lg outline-none"
                    src={`https://image.tmdb.org/t/p/original/${
                      movieDetailData?.poster_path ||
                      movieDetailData?.backdrop_path
                    }`}
                    alt={
                      movieDetailData?.original_title || movieDetailData?.title
                    }
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="max-sm:pb-20 max-md:pt-5">
                <div className="max-sm:pl-5">
                  <h1 className="text-white text-3xl sm:text-3xl md:text-4xl lg:text-6xl pb-4 pl-1 font-[Poppins] font-bold">
                    {movieDetailData?.title || ""}
                  </h1>
                  <div className="pl-1 md:inline-flex">
                    <div className="inline-flex">
                      <span>
                        <BsStarFill size={30} color="gold" />
                      </span>
                      <span className="text-white text-3xl pl-2 font-[Poppins] font-thin">
                        {movieDetailData?.vote_average || ""}
                      </span>

                      <span className="text-slate-300 text-2xl pl-3">|</span>
                      <span className="text-white/70 text-2xl pt-1.5 pl-2 font-[Poppins] font-light">
                        {movieDetailData?.vote_count || ""}
                      </span>
                    </div>
                    <div className="inline-flex md:pl-4">
                      <span className="text-white/75 pt-[0.7rem] pl-1 font-[Poppins]">
                        {movieDetailData?.original_language || ""}
                      </span>
                      <span className="text-white/75 pt-[0.7rem] pl-6">
                        <ul>
                          <li className="list-item list-disc">
                            Action , Adventure
                          </li>
                        </ul>
                      </span>
                      <span className="text-white/75 pt-[0.7rem] pl-6">
                        <ul>
                          <li className="list-item list-disc">
                            {movieDetailData?.release_date || ""}
                          </li>
                        </ul>
                      </span>
                    </div>
                  </div>
                  <div className="pl-1 md:pl-2">
                    <p className=" text-white/80 text-md pt-5 font-mono font-light  max-w-[90%] md:max-w-[65%] lg:max-w-[70%] xl:max-w-[75%]">
                      {movieDetailData?.overview || ``}
                    </p>
                  </div>
                  <div className="pt-5 pl-3">
                    <button
                      className="text-center text-white/80 bg-none px-3 py-[4px] rounded-md text-xl font-light border-white/80 border-solid border-[1px] hover:bg-slate-50 hover:text-black hover:duration-500 duration-1000"
                      onClick={redirectToPlatforms}
                    >
                      Streaming Platforms
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
          <h1 className="text-white text-3xl font-thin font-mono ">
            Loading...
          </h1>
        </div>
      )}
    </>
  );
};

export default MovieDetailsPage;
