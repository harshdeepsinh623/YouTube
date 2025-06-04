export const mockVideos = [
  {
    kind: "youtube#video",
    id: "mock_video_1",
    snippet: {
      publishedAt: "2023-01-15T15:00:00Z",
      channelId: "mock_channel_1",
      title: "How to Build a YouTube Clone with React",
      description: "Learn how to build a YouTube clone using React, Firebase, and the YouTube API.",
      thumbnails: {
        medium: {
          url: "https://via.placeholder.com/320x180.png?text=React+YouTube+Clone",
          width: 320,
          height: 180
        }
      },
      channelTitle: "React Developers",
      categoryId: "28"
    },
    statistics: {
      viewCount: "1500000",
      likeCount: "25000",
      commentCount: "1200"
    },
    contentDetails: {
      duration: "PT15M33S"
    }
  },
  {
    kind: "youtube#video",
    id: "mock_video_2",
    snippet: {
      publishedAt: "2023-02-20T12:30:00Z",
      channelId: "mock_channel_2",
      title: "JavaScript Tips and Tricks for 2023",
      description: "Discover the best JavaScript tips and tricks to improve your coding skills in 2023.",
      thumbnails: {
        medium: {
          url: "https://via.placeholder.com/320x180.png?text=JavaScript+Tips",
          width: 320,
          height: 180
        }
      },
      channelTitle: "JavaScript Masters",
      categoryId: "28"
    },
    statistics: {
      viewCount: "980000",
      likeCount: "18500",
      commentCount: "850"
    },
    contentDetails: {
      duration: "PT12M45S"
    }
  },
  {
    kind: "youtube#video",
    id: "mock_video_3",
    snippet: {
      publishedAt: "2023-03-05T09:15:00Z",
      channelId: "mock_channel_3",
      title: "The Future of Web Development",
      description: "Explore the future trends of web development and what skills you need to stay relevant.",
      thumbnails: {
        medium: {
          url: "https://via.placeholder.com/320x180.png?text=Web+Development+Future",
          width: 320,
          height: 180
        }
      },
      channelTitle: "Web Dev Insights",
      categoryId: "28"
    },
    statistics: {
      viewCount: "750000",
      likeCount: "15000",
      commentCount: "620"
    },
    contentDetails: {
      duration: "PT18M22S"
    }
  },
  {
    kind: "youtube#video",
    id: "mock_video_4",
    snippet: {
      publishedAt: "2023-04-10T14:45:00Z",
      channelId: "mock_channel_4",
      title: "CSS Grid vs Flexbox: When to Use Each",
      description: "Learn when to use CSS Grid and when to use Flexbox for optimal layouts.",
      thumbnails: {
        medium: {
          url: "https://via.placeholder.com/320x180.png?text=CSS+Grid+vs+Flexbox",
          width: 320,
          height: 180
        }
      },
      channelTitle: "CSS Wizards",
      categoryId: "28"
    },
    statistics: {
      viewCount: "620000",
      likeCount: "12000",
      commentCount: "480"
    },
    contentDetails: {
      duration: "PT10M15S"
    }
  },
  {
    kind: "youtube#video",
    id: "mock_video_5",
    snippet: {
      publishedAt: "2023-05-22T11:00:00Z",
      channelId: "mock_channel_5",
      title: "Building a Responsive Dashboard with React",
      description: "Step-by-step guide to building a responsive admin dashboard using React and Material UI.",
      thumbnails: {
        medium: {
          url: "https://via.placeholder.com/320x180.png?text=React+Dashboard",
          width: 320,
          height: 180
        }
      },
      channelTitle: "UI/UX Masters",
      categoryId: "28"
    },
    statistics: {
      viewCount: "480000",
      likeCount: "9500",
      commentCount: "320"
    },
    contentDetails: {
      duration: "PT22M18S"
    }
  },
  {
    kind: "youtube#video",
    id: "mock_video_6",
    snippet: {
      publishedAt: "2023-06-15T16:30:00Z",
      channelId: "mock_channel_6",
      title: "Node.js Best Practices for Production",
      description: "Learn the best practices for deploying Node.js applications in production environments.",
      thumbnails: {
        medium: {
          url: "https://via.placeholder.com/320x180.png?text=Node.js+Production",
          width: 320,
          height: 180
        }
      },
      channelTitle: "Backend Developers",
      categoryId: "28"
    },
    statistics: {
      viewCount: "350000",
      likeCount: "7200",
      commentCount: "280"
    },
    contentDetails: {
      duration: "PT16M42S"
    }
  }
];

export const mockChannels = [
  {
    kind: "youtube#channel",
    id: {
      kind: "youtube#channel",
      channelId: "mock_channel_1"
    },
    snippet: {
      title: "React Developers",
      description: "The best channel for React development tutorials and tips.",
      thumbnails: {
        default: {
          url: "https://via.placeholder.com/88x88.png?text=React+Dev",
          width: 88,
          height: 88
        }
      },
      publishedAt: "2020-01-01T00:00:00Z"
    },
    statistics: {
      viewCount: "15000000",
      subscriberCount: "500000",
      videoCount: "320"
    }
  },
  {
    kind: "youtube#channel",
    id: {
      kind: "youtube#channel",
      channelId: "mock_channel_2"
    },
    snippet: {
      title: "JavaScript Masters",
      description: "Advanced JavaScript tutorials for experienced developers.",
      thumbnails: {
        default: {
          url: "https://via.placeholder.com/88x88.png?text=JS+Masters",
          width: 88,
          height: 88
        }
      },
      publishedAt: "2019-05-15T00:00:00Z"
    },
    statistics: {
      viewCount: "12000000",
      subscriberCount: "420000",
      videoCount: "280"
    }
  },
  {
    kind: "youtube#channel",
    id: {
      kind: "youtube#channel",
      channelId: "mock_channel_3"
    },
    snippet: {
      title: "Web Dev Insights",
      description: "Insights and analysis of the latest web development trends.",
      thumbnails: {
        default: {
          url: "https://via.placeholder.com/88x88.png?text=Web+Dev",
          width: 88,
          height: 88
        }
      },
      publishedAt: "2018-11-20T00:00:00Z"
    },
    statistics: {
      viewCount: "9500000",
      subscriberCount: "380000",
      videoCount: "210"
    }
  }
];