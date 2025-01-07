import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as webllm from "https://esm.run/@mlc-ai/web-llm";

// Suppress warnings
console.warn = () => {};

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  urlToImage: string;
}

interface MarketOverviewProps {
  onOverviewGenerated: (overview: string) => void;
}

const carouselSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
};

export const MarketOverview = ({ onOverviewGenerated }: MarketOverviewProps) => {
  const [formattedOverview, setFormattedOverview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [engine, setEngine] = useState<webllm.MLCEngine | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Track AI processing state
  const [isLLMEnabled, setIsLLMEnabled] = useState<boolean>(false); // Track if LLM is enabled

  // Initialize Web LLM
  useEffect(() => {
    if (isLLMEnabled) {
      const initializeWebLLM = async () => {
        try {
          const initProgressCallback = (report) => {
            setLoadingProgress(`Loading model: ${report.text}`);
            setProgressPercentage(report.progress * 100);
          };

          const selectedModel = "Hermes-2-Pro-Mistral-7B-q4f16_1-MLC";
          const engine = await webllm.CreateMLCEngine(selectedModel, {
            initProgressCallback: initProgressCallback,
          });

          setEngine(engine);
          setLoadingProgress("Model loaded successfully!");
          setProgressPercentage(100);
        } catch (error) {
          console.error("Error initializing Web LLM:", error);
          setError("Failed to initialize LLM. Please try again later.");
          setLoadingProgress("Model loading failed.");
          setProgressPercentage(0);
        }
      };

      initializeWebLLM();
    }
  }, [isLLMEnabled]);

  // Fetch the news data
  const fetchNews = async () => {
    const APIKEY = import.meta.env.VITE_NEWS_API_KEY;
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${APIKEY}`
      );
      console.log("Fetched news:", response.data.articles.slice(0, 5)); // Fetch last 3 articles
      return response.data.articles.slice(0, 5); // Limit to 3 articles
    } catch (error) {
      console.error("Error fetching Bitcoin news:", error);
      setError("Failed to fetch Bitcoin news. Please try again later.");
      throw error;
    }
  };

  const { data: news, isLoading: isNewsLoading, isError: isNewsError } = useQuery({
    queryKey: ["bitcoinNews"],
    queryFn: fetchNews,
    refetchInterval: 300000,
  });

  // Analyze news articles with Web LLM
  // const analyzeNewsWithLLM = useCallback(
  //   async (articles: NewsItem[]) => {
  //     if (!engine) {
  //       throw new Error("Web LLM engine not initialized.");
  //     }

  //     setIsProcessing(true); // Start processing

  //     const prompt = `
  //     Dont print anything else than the JSON object and keep the same urlToImage !! 
  //       Summarize the following Bitcoin news articles in a concise manner. Focus on the key points and trim unnecessary details. Return the summary in the following JSON format:
  //       {
  //         "summary": "Concise summary of the last 2 articles.",
  //         "articles": [
  //           {
  //             "title": "Article 1 Title",
  //             "description": "Article 1 Description",
  //             "url": "Article 1 URL",
  //             "publishedAt": "Article 1 Published Date",
  //             "urlToImage": "Article 1 Image URL"
  //           },
  //         ]
  //       }
  //       Articles:
  //       ${articles
  //         .map(
  //           (article) => `
  //         Title: ${article.title}
  //         Description: ${article.description}
  //         URL: ${article.url}
  //         Published At: ${article.publishedAt}
  //         Image URL: ${article.urlToImage}
  //       `
  //         )
  //         .join("\n")}
  //     `;

  //     try {
  //       const response = await engine.chat.completions.create({
  //         messages: [{ role: "user", content: prompt }],
  //         temperature: 1.0,
  //         top_p: 1,
  //         max_gen_len: 512,
  //       });

  //       const responseText = response.choices[0].message.content;
  //       console.log("LLM response:", responseText);
  //       const parsedResponse = JSON.parse(responseText);
  //       setIsProcessing(false); // Stop processing
  //       return parsedResponse;
  //     } catch (error) {
  //       console.error("Failed to parse LLM response as JSON:", error);
  //       setIsProcessing(false); // Stop processing even if there's an error
  //       throw new Error("LLM response is not valid JSON.");
  //     }
  //   },
  //   [engine]
  // );

  useEffect(() => {
    if (isLLMEnabled && news && !isNewsLoading && !error && engine) {
      analyzeNewsWithLLM(news)
        .then(async (result) => {
          setFilteredNews(result.articles);

          // Generate a summary of the articles
          const summary = result.summary;
          setFormattedOverview(summary);
          onOverviewGenerated(summary);
        })
        .catch((error) => {
          console.error("Error analyzing news with LLM:", error);
          setError("Failed to filter news. Please try again later.");
        });
    } else if (news && !isNewsLoading && !error) {
      // If LLM is not enabled, just set the news directly
      setFilteredNews(news);
    }
  }, [news, onOverviewGenerated, error, engine, isNewsLoading, isNewsError, isLLMEnabled]);

  // Display loading screen
  if (isNewsLoading || (isLLMEnabled && !engine)) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <div className="w-full max-w-4xl rounded-2xl shadow-neumorphism p-6">
          <Skeleton className="w-full h-72 rounded-2xl" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">{loadingProgress}</p>
            <div className="w-full rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || isNewsError) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-neumorphism p-6">
          <p className="text-sm text-red-500">{error || "Failed to load news"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Enable/Disable LLM Button */}
      <div className="w-full max-w-6xl mx-auto">
        {/* <button
          onClick={() => setIsLLMEnabled(!isLLMEnabled)}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300"
        >
          {isLLMEnabled ? "Disable LLM" : "Enable LLM"}
        </button> */}
      </div>

      {/* AI is Thinking Indicator */}
      {isProcessing && (
        <div className="w-full max-w-6xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-neumorphism p-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce delay-100"></div>
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce delay-200"></div>
            </div>
            <p className="mt-4 text-sm text-gray-600">AI is thinking...</p>
          </div>
        </div>
      )}

      {/* Carousel Section */}
      <div className="w-full max-w-6xl mx-auto">
        <Slider {...carouselSettings}>
          {filteredNews.map((article, index) => (
            <div key={index} className="p-2">
              <div className="bg-white rounded-2xl shadow-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="relative h-40 overflow-hidden rounded-xl">
                  <img
                    src={article.urlToImage || "https://via.placeholder.com/150"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-md font-semibold text-white line-clamp-2">
                    {article.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                  {article.description || "No description available."}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-sm"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Overview Section */}
      {/* {isLLMEnabled && (
        <div className="w-full max-w-6xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-neumorphism p-6">
            <p className="text-sm text-gray-600">{formattedOverview}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};