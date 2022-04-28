/* eslint-disable */
import { useState, useRef, useEffect } from "react";
import ChatList from "../../component/chat/chatList";
import { styled, TextField, IconButton, Box, Typography } from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import VideocamIcon from "@mui/icons-material/Videocam";
import ChatTabs from "../../component/chat/chatTabs";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import RecorderDialog from "../../component/recorder/recoderDialog";
import ChatBoxOfOther from "../../component/chat/chatBoxOfOther";
import CorrectMessage from "../../component/chat/correctMessage";
// chat websocket
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// axios
import axios from "axios";

const ChatTypographyByMe = styled(Typography)({
  borderRadius: "20px",
  padding: "10px 20px",
  backgroundColor: "skyblue",
  color: "white",
  fontWeight: 500,
});

const ChatBox = styled(Box)({
  overflowY: "auto",
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

let stompClient: any = null;

export default function Chat() {
  // 유저 정보 가져오기
  const [userData, setUserData] = useState<any>(null);
  const setToken = () => {
    const token = localStorage.getItem("jwt");
    const config = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  };
  const getProfile = async () => {
    axios({
      url: "https://blahblah.community:8443/api/user/me",
      method: "get",
      headers: setToken(),
    }).then((res) => {
      setUserData(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getProfile();
  }, []);

  // 채팅 웹소켓 연결

  const connect = () => {
    let socket = new SockJS("https://blahblah.community:8080/chat-websocket");

    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame: any) {
      console.log("Connected:" + frame);
      stompClient.subscribe("/topic/" + userData.id, function (msg: any) {
        console.log(msg);
        updateLastRead();
        list();
      });
      // 채팅 목록 가져오기
      stompClient.subscribe("/topic/list/" + userData.id, function (msg: any) {
        console.log(msg.body);
        let tmpMsg = JSON.parse(msg.body);
        setChattingList(tmpMsg);
      });
      // 채팅 히스토리 가져오기
      getChatHistory();

      list();
    });
  };

  const [chattingList, setChattingList] = useState<any[]>([]);

  const updateLastRead = () => {
    console.log("list");
    stompClient.send(
      "chat/read/" + userData.id + "/" + 1,
      {},
      JSON.stringify({})
    );
  };

  const list = () => {
    console.log("list");
    stompClient.send("/chat/list/" + userData.id, {}, JSON.stringify({}));
  };

  const getChatHistory = () => {
    console.log("히스토리");
    stompClient.send(
      "/chat/history/" +
        userData.id +
        "/" +
        "7a819932-4ed4-425f-b66a-05209a4c0a05",
      {},
      JSON.stringify({})
    );
  };

  const sendMsg = () => {
    if (stompClient) {
      stompClient.send(
        "/chat/send/" + 1 + "/to-other",
        {},
        JSON.stringify({
          type: "text",
          senderId: userData.id,
          senderName: userData.name,
          roomId: "7a819932-4ed4-425f-b66a-05209a4c0a05",
          receiverId: 1,
          receiverName: "김싸피",
          content: message,
        })
      );

      stompClient.send(
        "/chat/send/" + userData.id + "/to-me",
        {},
        JSON.stringify({
          type: "text",
          senderId: userData.id,
          senderName: userData.name,
          roomId: "7a819932-4ed4-425f-b66a-05209a4c0a05",
          receiverId: 1,
          receiverName: "김싸피",
          content: message,
        })
      );
    } else {
      alert("stompclient null상태");
    }
  };

  useEffect(() => {
    if (userData) {
      connect();
    }
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [userData]);

  const dummyMessageList = [
    {
      username: "Geuntae",
      message: "Hello?",
    },
    {
      username: "me",
      message: "Hello!",
    },
    {
      username: "Geuntae",
      message: "Nice to meet you!",
    },
    {
      username: "Geuntae",
      message: "What do you do?",
    },
    {
      username: "me",
      message: "I am a frontend developer!",
    },
    {
      username: "Geuntae",
      message: "That's cool!",
    },
  ];
  const [messageList, setMessageList] = useState<any[]>(dummyMessageList);
  const [message, setMessage] = useState<string>("");
  const handleMessage = (e: any) => {
    setMessage(e.target.value);
  };

  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const handleMessageList = () => {
    if (message) {
      sendMsg();
      // setMessageList([...messageList, { username: "me", message: message }]);
      setMessage("");
    } else {
      alert("메시지를 입력해주세요.");
    }
  };
  // recorder dialog 열고 닫기
  const [openRecorder, setOpenRecorder] = useState(false);
  const handleClickOpenRecorder = () => {
    setOpenRecorder(true);
  };

  const handleClose = () => {
    setOpenRecorder(false);
  };

  const [chatname, setChatname] = useState("Geuntae");

  const [correctMessage, setCorrectMessage] = useState("");

  return (
    <>
      <Box
        style={{
          height: "80vh",
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {chattingList && (
          <Box>
            <ChatList chattingList={chattingList} setChatname={setChatname} />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            border: "1px solid black",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "50%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: 3,
              borderBottom: "1px solid black",
              justifyContent: "space-between",
            }}
          >
            <Typography>username: {chatname}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  alert("영상통화 버튼 눌림.");
                }}
              >
                <VideocamIcon sx={{ color: "black" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  alert("신고 버튼 눌림");
                }}
              >
                <ReportIcon color="warning" />
              </IconButton>
            </Box>
          </Box>
          <ChatBox ref={chatRef} className="chatbox-scroll">
            {messageList &&
              messageList.map((item, index) => {
                if (item.username === "me") {
                  return (
                    <Box
                      sx={{
                        width: "100%",
                        padding: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                      }}
                      key={index}
                    >
                      <ChatTypographyByMe>{item.message}</ChatTypographyByMe>
                    </Box>
                  );
                } else {
                  return (
                    <ChatBoxOfOther
                      key={index}
                      message={item.message}
                      setCorrectMessage={setCorrectMessage}
                    />
                  );
                }
              })}
          </ChatBox>
          <Box
            sx={{
              borderTop: "1px solid black",
              width: "100%",
              height: "15%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {correctMessage && (
              <CorrectMessage
                correctMessage={correctMessage}
                setCorrectMessage={setCorrectMessage}
              />
            )}
            <Box>
              <TextField
                sx={{ width: "30vw" }}
                value={message}
                placeholder="Type your message."
                onChange={handleMessage}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    handleMessageList();
                  }
                }}
                variant="standard"
              />
              <IconButton onClick={handleMessageList}>
                <SendIcon color="primary" />
              </IconButton>
              <IconButton onClick={handleClickOpenRecorder}>
                <MicIcon sx={{ color: "black" }} />
              </IconButton>
            </Box>

            <RecorderDialog
              openRecorder={openRecorder}
              setOpenRecorder={setOpenRecorder}
              handleClose={handleClose}
            />
          </Box>
        </Box>
        <ChatTabs />
      </Box>
    </>
  );
}