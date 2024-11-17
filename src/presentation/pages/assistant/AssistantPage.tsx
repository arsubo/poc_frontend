import { useEffect, useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import {
  createThreadUseCase,
  postQuestionUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string>();

  const messagesContainerRef = useRef<HTMLDivElement>(null); // Referencia al contenedor de mensajes
  const lastMessageRef = useRef<HTMLDivElement>(null); // Referencia al último mensaje

  //obtener el thread

  useEffect(() => {
    const threadId = localStorage.getItem("threadId");
    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase().then((threadId) => {
        setThreadId(threadId);
        localStorage.setItem("threadId", threadId);
      });
    }

    //messageContainer.current?.scrollTop();
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [
        ...prev,
        { text: `Número de threadId: ${threadId}`, isGpt: true },
      ]);
    }
  }, [threadId]);

  useEffect(() => {
    // Cuando se actualizan los mensajes, desplazar al último mensaje si ya hay mensajes
    if (messages.length > 0 && messagesContainerRef.current) {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    // Si ya hay mensajes en la lista, guardamos la posición actual del scroll antes de agregar nuevos mensajes
    if (messages.length > 0 && messagesContainerRef.current) {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    //llama al caso de uso
    const replies = await postQuestionUseCase(threadId!, text);

    setIsLoading(false);

    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages((prev) => [
          ...prev,
          { text: message, isGpt: reply.role === "assistant", info: reply },
        ]);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={messagesContainerRef}>
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola soy Sam, ¿En qué puedo ayudar hoy?" />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
          {/* Referencia al último mensaje */}
          <div ref={lastMessageRef}></div>
        </div>
      </div>
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
