"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Send, Paperclip, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { respondPqrs } from "@/lib/api/admin";
import { toast } from "sonner";
import type { PqrsMessage } from "@/lib/api/types";

interface MessageThreadProps {
  messages: PqrsMessage[];
  ticketId: string;
  onMessageSent: () => void;
}

export function MessageThread({
  messages,
  ticketId,
  onMessageSent,
}: MessageThreadProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!content.trim()) return;

    setSending(true);
    try {
      await respondPqrs(ticketId, content.trim());
      setContent("");
      toast.success("Respuesta enviada");
      onMessageSent();
    } catch {
      toast.error("Error al enviar la respuesta");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 max-h-[500px] pr-4">
        <div className="space-y-4 py-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No hay mensajes aún.
            </p>
          )}
          {messages.map((message) => {
            const isAdmin = message.senderRole === "ADMIN";
            const isSystem = message.senderRole !== "CLIENT" && message.senderRole !== "ADMIN";
            const isClient = message.senderRole === "CLIENT";

            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="max-w-md px-4 py-2 text-center">
                    <p className="text-sm italic text-muted-foreground">
                      {message.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(message.createdAt), "dd MMM yyyy, HH:mm", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-3 ${
                    isAdmin
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      {message.sender
                        ? `${message.sender.firstName} ${message.sender.lastName}`
                        : isClient
                        ? "Cliente"
                        : "Admin"}
                    </span>
                    <span
                      className={`text-xs ${
                        isAdmin
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {format(new Date(message.createdAt), "dd MMM yyyy, HH:mm", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 text-xs underline ${
                            isAdmin
                              ? "text-primary-foreground/80 hover:text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Paperclip className="h-3 w-3" />
                          Adjunto
                          <Download className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Escribe tu respuesta... (Ctrl+Enter para enviar)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px]"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!content.trim() || sending}
            size="icon"
            className="shrink-0 self-end h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
