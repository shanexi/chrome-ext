import {
  AgentChatInputHandlers,
  AgentChatInputModelFactory,
  NO_MESSAGE_ID_AGENT_CHAT_INPUT,
} from "@myshell-run/agent-chat-input-plugins";
import { OWN_MESSAGE_TYPE } from "@myshell-run/agent-message-plugins";
import { AGENT_CHAT, ChatCommonModelFactory } from "@myshell-run/common-def";
import {
  ChatCommonHandlers,
  ChatCommonModel,
  ChatInputDoc,
  ContextItem,
  UploadItem,
} from "@myshell-run/common-ui";
import { createId } from "@paralleldrive/cuid2";
import { inject, injectable } from "inversify";
import { makeObservable, toJS } from "mobx";

@injectable()
export class ShellAgentChatModel
  implements AgentChatInputHandlers, ChatCommonHandlers
{
  constructor(
    @inject(ChatCommonModelFactory)
    public factory: (id: symbol) => ChatCommonModel,
    @inject(AgentChatInputModelFactory)
    public chatInputFactory: AgentChatInputModelFactory
  ) {
    makeObservable(this);
  }
  async *retryMessage(messageId: number) {
    console.log("retryMessage", messageId);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    yield;
  }

  async *sendChatInputDocVariant(
    chatInputDoc: ChatInputDoc,
    upload: UploadItem[],
    context: ContextItem[]
  ) {
    console.log("sendChatInputDocVariant");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // todo
    // 等待请求之后回来，进行 router 跳转
    yield;
  }

  get chatCommon() {
    return this.factory(AGENT_CHAT);
  }

  async *sendChatInputDoc(
    chatInputDoc: ChatInputDoc,
    uploads: UploadItem[],
    context: ContextItem[]
  ) {
    yield;
    // // TODO: 对接后端
    console.log("send", uploads, context, toJS(chatInputDoc));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async *sendText(text: string) {
    const msgId = createId();

    this.chatCommon.virtuoso.appendMsg({
      key: msgId,
      text: text,
      type: OWN_MESSAGE_TYPE,
    });

    yield;
  }

  addToContext(context: ContextItem) {
    const edix = this.chatInputFactory(
      this.chatCommon.enabledChatInputMessageKey ||
        NO_MESSAGE_ID_AGENT_CHAT_INPUT
    ).edix;
    edix.addToContext(context);
  }

  async sendTextVariant(text: string) {
    const key = createId();
    const chatInputDoc = [[{ type: "text", text }]];
    this.chatCommon.virtuoso.virtuosoRef?.current?.data.append(
      [
        {
          key: key,
          text: text,
          type: OWN_MESSAGE_TYPE,
          args: {
            chatInputDoc,
            context: [],
          },
        },
      ],
      ({ scrollInProgress, atBottom }) => {
        return {
          index: "LAST",
          align: "start-no-overflow",
          behavior: atBottom || scrollInProgress ? "smooth" : "auto",
        };
      }
    );
  }

  async *stop(messageId: number | undefined) {
    console.log("stop", messageId);
    yield;
  }
}
