import { useContext, useEffect, useRef, useState } from 'react';
import { WidgetContext } from '../lib/context';
import { Button, Card, CardBody, CardHeader, Divider, Image } from '@heroui/react';
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon, Message01Icon, SentIcon, ChipIcon, ReloadIcon } from "hugeicons-react";
import { getFiles, sendMessageToAI } from '../../api/api';
import { AnimatePresence, motion, wrap } from 'framer-motion';
import Draggable from 'react-draggable';
import { IconsToSelect } from '../../utils/icons';
import { formatNumberToCurrency } from '../../functions/formaters.js';
import DotSlider from './dot-slider.js';
import { v4 as uuidv4 } from 'uuid';

interface ButtonConfig {
  icon: string
  name: string
  id: string
  instruction: string
}
interface Config {
  colorHeader: string,
  buttonSize: number,
  mainIcon: string,
  widgetName: string,
  defaultMessage: string,
  enable: boolean,
  isButtonsEnabled: boolean,
  buttons: ButtonConfig[]
}
enum ChatType {
  BUTTONS = 'BUTTONS',
  PRODUCT = 'PRODUCT',
  MESSAGE = 'MESSAGE'
}
interface Product {
  name: string,
  description: string,
  imagen: string,
  currentPrice: number,
  oldPrice: number,
  productLink: string
}
interface Chat {
  type: ChatType,
  message?: Message
  products?: Product[]
  customButtons?: ButtonConfig[]
}

interface Message {
  isHuman: boolean
  content: string
  date: Date
}

const variants = {
  enter: {
    opacity: 0,
  },
  center: {
    zIndex: 1,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    opacity: 0,
  },
};
// const products = [
//   {
//     name: 'Convector Eléctrico Ursus Trotter UT N10 2.0 kW',
//     description: 'La estufa a gas infrarroja UT GR-2800ET de Ursus Trotter entrega calefacción rápida y eficiente para',
//     imagen: 'https://images.jumpseller.com/store/oym-agencia/5676339/665600050_2.jpg?1743619492',
//     currentPrice: '67990',
//     oldPrice: '84990',
//     productLink: ''
//   },
//   {
//     name: 'Estufa a Gas Infrarroja Ursus Trotter UT GR-2800ET',
//     description: 'La estufa a gas infrarroja UT FRX-2800ET de Ursus Trotter entrega calor inmediato y eficiente para espacios',
//     imagen: 'https://cdnx.jumpseller.com/oym-agencia/image/61364908/thumb/1438/1438?1746018035',
//     currentPrice: '67990',
//     oldPrice: '84990',
//     productLink: ''
//   },
//   {
//     name: 'Estufa a Gas Infrarroja Ursus Trotter UT FRX',
//     description: 'La estufa a gas infrarroja UT GR-2800ET de Ursus Trotter entrega calefacción rápida y eficiente',
//     imagen: 'https://cdnx.jumpseller.com/oym-agencia/image/34115086/thumb/1438/1438?1746041997',
//     currentPrice: '67990',
//     oldPrice: '84990',
//     productLink: ''
//   }
// ]

export function Widget() {
  const [isAgentLoading, setIsAgentLoading] = useState(false)
  const { isOpen, setIsOpen, clientKey } = useContext(WidgetContext);
  const [currentThread, setCurrentThread] = useState('')
  const [widget, setWidget] = useState<Config>({
    colorHeader: '#701bc7',
    buttonSize: 2.5,
    mainIcon: '',
    widgetName: 'Chat Klug',
    defaultMessage: 'Hola!',
    enable: false,
    isButtonsEnabled: false,
    buttons: []
  });
  const [sizeFont, setSizeFont] = useState(1)

  const isDraggingRef = useRef(false);
  const buttonModalRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef(null);
  const chatsRef = useRef<HTMLDivElement>(null)

  const combinedRef = (node: any) => {
    nodeRef.current = node;
    buttonModalRef.current = node;
  };

  const [widgetPosition, setWidgetPosition] = useState({ top: 0, left: 0 })
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState<Chat[]>([])

  const [[page,], setPage] = useState([0, 0]);
  const [currentPage, setCurrentPage] = useState(0)


  // const slideIndex = wrap(0, products.length, page);


  const paginateDot = (page: number) => {
    setPage([page, page]);
    setCurrentPage(page)
  }

  const paginate = (newDirection: number) => {
    setPage([((page + newDirection) > 2 || (page + newDirection) < 0) ? 0 : page + newDirection, newDirection]);
    setCurrentPage(((page + newDirection) > 2 || (page + newDirection) < 0) ? 0 : page + newDirection)
  };
  const openWidget = () => {
    if (!buttonModalRef.current || !containerRef.current) return;

    const rect = buttonModalRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const widgetWidth = 480;
    const widgetHeight = 720;
    const padding = 10;
    let left = rect.left - containerRect.left;
    let top = rect.top - containerRect.top;
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    if (left + widgetWidth > containerWidth) {
      left = rect.right - widgetWidth - containerRect.left;
    }

    if (top + widgetHeight > containerHeight) {
      top = rect.bottom - widgetHeight - containerRect.top - 75;
    }
    else {
      top += 75
    }

    if (left < padding) left = padding;
    if (top < padding) top = padding;

    setWidgetPosition({ top, left });
    setIsOpen(true);
  };

  const onDrag = () => {
    isDraggingRef.current = true;
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };
  const startRestartChat = (isNew: boolean = false, data?: Config) => {
    console.log("startRestartChat", widget)
    if (isNew) {
      setChats([])
      setCurrentThread(uuidv4())
    }
    const newChat: Chat[] = [
      {
        type: ChatType.MESSAGE,
        message: {
          isHuman: false,
          content: `¡Hola! Bienvenida/o a ${widget.widgetName} ¿En qué puedo ayudarte hoy?`,
          date: new Date()
        },
      }
    ]
    if (data && data.buttons.length > 0) {
      console.log("BUTTONS", data)
      newChat.push({
        type: ChatType.BUTTONS,
        customButtons: data.buttons
      })
    }
    setChats((prev) => [...prev, ...newChat])
  }
  const addChat = (message: string) => {
    setChats(prev => [...prev, { type: ChatType.MESSAGE, message: { isHuman: true, content: message, date: new Date() } }]);
    setIsAgentLoading(true)
    sendMessageToAI(clientKey, currentThread, message)
      // .then((res) => {
      //   console.log("RES", res)
      //   setChats(prev => [...prev, { type: ChatType.MESSAGE, message: { isHuman: false, content: res?.response, date: new Date(res?.additional_kwargs?.created_at) } }]);
      //   setIsAgentLoading(false)
      // })
      // .catch((error) => {
      //   console.log("ERROR", error)
      // })
      .then((res) => {
        console.log("RES", res)
        // const parsed = JSON.parse(res?.response);
        try {
          const parsed = JSON.parse(res?.response);
          if (Array.isArray(parsed)) {
            console.log("RES IS UN JSON")
            setChats(prev => [...prev, { type: ChatType.PRODUCT, products: parsed }]);
          }
          setIsAgentLoading(false)
        }
        catch {
          setChats(prev => [...prev, { type: ChatType.MESSAGE, message: { isHuman: false, content: res?.response, date: new Date(res?.additional_kwargs?.created_at) } }]);
          setIsAgentLoading(false)
        }

      })
      .catch((error) => {
        console.log("ERROR", error)
        setIsAgentLoading(false)
      })
  };

  const addButtonAction = (message: string) => {
    setIsAgentLoading(true)
    sendMessageToAI(clientKey, currentThread, message)
      .then((res) => {
        console.log("RES", res)
        // const parsed = JSON.parse(res?.response);
        try {
          const parsed = JSON.parse(res?.response);
          if (Array.isArray(parsed)) {
            console.log("RES IS UN JSON")
            setChats(prev => [...prev, { type: ChatType.PRODUCT, products: parsed }]);
          }
          setIsAgentLoading(false)
        }
        catch {
          setChats(prev => [...prev, { type: ChatType.MESSAGE, message: { isHuman: false, content: res?.response, date: new Date(res?.additional_kwargs?.created_at) } }]);
          setIsAgentLoading(false)
        }

      })
      .catch((error) => {
        console.log("ERROR", error)
        setIsAgentLoading(false)
      })
  };
  useEffect(() => {
    chatsRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log(chats)
  }, [chats]);

  useEffect(() => {
    getFiles(clientKey)
      .then((res) => {
        setWidget(res.data)
        return startRestartChat(true, res.data)
      })
      .then(() => { })
      .catch((error) => console.log("ERROR", error));
  }, []);

  const onSizeFontChange = (isAdd: boolean) => {
    if (isAdd && sizeFont < 1.75) {
      setSizeFont(sizeFont + 0.25)
    }
    else if (!isAdd && sizeFont > 1) {
      setSizeFont(sizeFont - 0.25)
    }
  }
  return (
    <div
      className="w-screen h-screen flex flex-col gap-4 absolute z-[9999] "
      ref={containerRef}>
      <Draggable onStop={onStop} onDrag={onDrag} nodeRef={nodeRef}>
        <Button
          ref={combinedRef}
          className={` p-2 text-white absolute  rounded-full`}
          style={{
            width: widget.buttonSize + "rem",
            height: widget.buttonSize + "rem",
            backgroundColor: widget.colorHeader,
            bottom: '4rem',
            right: '4rem'
          }}
          onPress={() => {
            console.log("CLICK")
            if (isOpen) {
              setIsOpen(false)
            }
            else {
              openWidget()
            }
          }}
          isIconOnly
        >
          <Message01Icon className="h-full w-full" strokeWidth={2} />
        </Button>
      </Draggable>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="widget"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`absolute w-[30rem] h-[45rem] bg-white border border-gray-200 shadow-lg z-[9999] rounded-xl flex flex-col overflow-hidden`}
            style={{
              top: widgetPosition.top,
              left: widgetPosition.left
            }}
          >
            <div
              className=' absolute top-4 left-4 bg-white p-4 w-14 h-14 rounded-full border-1 border-black z-50' >
              {IconsToSelect.find((b) => b.key === widget.mainIcon) ?
                IconsToSelect.find((b) => b.key === widget.mainIcon)?.icon :
                <Image
                  src={widget.mainIcon} />}
              <div
                className='absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full'>
              </div>
            </div>
            <div className="relative flex flex-row gap-2 justify-between items-center pl-20 pr-2 w-full  h-20 rounded-t-xl"
              style={{ backgroundColor: widget.colorHeader }}>
              <div className='flex flex-col gap-0 justify-center items-start w-full'>
                <div className='text-white text-lg font-bold'>{widget.widgetName}</div>
                <div className='text-white text-tiny'>Disponible ahora</div>
              </div>
              <Button onPress={() => startRestartChat(true)} className='text-white bg-transparent hover:text-opacity-50' isIconOnly>
                <ReloadIcon className='stroke-2' />
              </Button>
              <Button onPress={() => setIsOpen(false)} className='text-white bg-transparent hover:text-opacity-50' isIconOnly>
                <Cancel01Icon className='stroke-2' />
              </Button>
              <div
                className='absolute right-10 -bottom-4 flex flex-row gap-2 z-50'>
                <button
                  className='border-1 border-gray-400 bg-white rounded-lg text-tiny h-8 w-8 font-semibold hover:bg-black hover:text-white'
                  onClick={() => onSizeFontChange(true)}>
                  +A
                </button>
                <button
                  className='border-1 border-gray-400 bg-white rounded-lg text-tiny h-8 w-8 font-semibold hover:bg-black hover:text-white'
                  onClick={() => onSizeFontChange(false)}>
                  -A
                </button>
              </div>
            </div>

            <div className="h-[35rem] w-full py-6 px-4 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
              {chats?.map((chat, index) =>
                <>
                  {chat.type === ChatType.MESSAGE &&
                    <div
                      className='flex flex-col gap-2'
                      key={index}>
                      <div
                        className={`w-full flex font-semibold text-gray-400 text-base ${chat?.message?.isHuman ? 'justify-end' : 'justify-start'}`}>
                        {chat?.message?.isHuman ? 'Tu' : widget.widgetName}
                      </div>
                      <div
                        className="flex justify-end">
                        <div
                          className={`border-1 rounded-2xl p-2  ${chat?.message?.isHuman ? 'w-fit max-w-3/4' : 'w-full'}`}
                          style={{
                            backgroundColor: chat?.message?.isHuman ? widget.colorHeader : '#ffffff',
                          }}
                        >
                          <div
                            className="whitespace-break-spaces break-words"
                            style={{
                              fontSize: sizeFont + "rem",
                              color: chat?.message?.isHuman ? "white" : 'black'
                            }}>
                            {chat?.message?.content}
                          </div>
                          <div
                            className="text-tiny"
                            style={{
                              color: chat?.message?.isHuman ? "white" : 'black'
                            }}>
                            {chat?.message?.date?.toLocaleDateString('es-ES', {
                              weekday: 'short',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>}
                  {(widget?.buttons.length > 0 && chat.type === ChatType.BUTTONS) &&
                    <div
                      className='w-full min-h-40 flex items-center justify-center'
                      key={index}>
                      <div
                        className="w-full flex flex-col gap-1 border-1 rounded-2xl overflow-hidden ">
                        {widget.buttons.map((button, index) =>
                          <Button key={index}
                            className={`w-full flex justify-between bg-stone-100 min-h-10 text-black hover:bg-black hover:text-white ${index > 0 && "border-t"} rounded-none transition-all duration-300 ease-in-out`}
                            startContent={
                              <>
                                {IconsToSelect.find((b) => b.key === widget.mainIcon) ?
                                  IconsToSelect.find((b) => b.key === widget.mainIcon)?.icon :
                                  <Image
                                    src={button?.icon}
                                    className="w-4" />}
                              </>
                            }
                            style={{ fontSize: sizeFont + "rem" }}
                            onPress={() => addButtonAction(button.instruction)}>
                            <div
                              className="w-full  text-left">
                              {button.name.substring(0, 30)}
                            </div>
                          </Button>
                        )}
                      </div>
                    </div>}
                  {(chat.products && chat.type === ChatType.PRODUCT) &&
                    <div
                      className='flex flex-col gap-4 relative h-[42rem] '
                    >
                      <motion.div
                        key={page}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          opacity: { duration: 0.5 },
                        }}
                        className="relative m-auto px-4"
                      >
                        <Card
                          className="min-h-[40rem] bg-stone-100 rounded-3xl  p-4 flex justify-center"
                          style={{ boxShadow: '0px 0px 8px 2px rgba(0,0,0,0.2)' }}>
                          <CardHeader
                            className="font-bold text-center w-full justify-center py-2">
                            {chat.products[wrap(0, chat.products.length, page)].name}
                          </CardHeader>
                          <CardBody
                            className="px-10 flex flex-col gap-2">
                            <div
                              className="w-full flex justify-center border-1  rounded-3xl ">
                              <Image
                                src={chat.products[wrap(0, chat.products.length, page)].imagen}
                                className="h-56 w-56 object-cover" />
                            </div>
                            <div>
                              {chat.products[wrap(0, chat.products.length, page)].description}
                            </div>
                            <div
                              className="font-bold">
                              {formatNumberToCurrency(chat.products[wrap(0, chat.products.length, page)].currentPrice)}
                            </div>
                            <div
                              className="line-through">
                              Antes {formatNumberToCurrency(chat.products[wrap(0, chat.products.length, page)].oldPrice)}
                            </div>
                            <div
                              className="w-full flex justify-center">
                              <Button
                                className="w-full rounded-full text-white font-bold hover:opacity-50"
                                style={{ backgroundColor: widget.colorHeader }}>
                                Ver producto
                              </Button>
                            </div>
                            <div
                              className="w-full flex justify-center">
                              <Button
                                className="rounded-full bg-transparent hover:bg-gray-400">
                                Ver detalle
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                      <div
                        className='flex flex-row justify-between w-full absolute top-1/2 z-50'>
                        <Button
                          className='flex justify-center min-h-10 min-w-10 rounded-full text-white opacity-75 hover:opacity-50'
                          style={{ backgroundColor: widget.colorHeader }}
                          isIconOnly
                          onPress={() => paginate(-1)}>
                          <ArrowLeft01Icon />
                        </Button>
                        <Button
                          className='flex justify-center min-h-10 min-w-10 rounded-full text-white opacity-75 hover:opacity-50'
                          style={{ backgroundColor: widget.colorHeader }}
                          isIconOnly
                          onPress={() => paginate(1)}>
                          <ArrowRight01Icon />
                        </Button>
                      </div>
                      <div
                        className='w-full flex justify-center'>
                        <DotSlider
                          totalDots={chat.products?.length}
                          activeDot={wrap(0, chat.products.length, page)}
                          paginateDot={paginateDot}
                          currentPage={currentPage}
                          color={widget.colorHeader}
                        />
                      </div>
                    </div>
                  }
                </>
              )}
              {isAgentLoading &&
                <div className="flex justify-start px-4">
                  <div className="border-1 rounded-2xl p-2 w-1/4 bg-white">
                    <div className="flex items-center justify-center gap-2 h-4">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                          delay: 0,
                        }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: widget?.colorHeader }}
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                          delay: 0.2,
                        }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: widget?.colorHeader }}
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                          delay: 0.4,
                        }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: widget?.colorHeader }}
                      />
                    </div>
                  </div>
                </div>
              }
              <div
                ref={chatsRef}></div>
            </div>
            <div
              className="w-full flex justify-center space-x-2 items-center text-tiny text-gray-400 py-2">
              <ChipIcon />
              <div>Powered by klug</div>
            </div>
            {!isAgentLoading &&
              <>
                <Divider />
                <div
                  className='w-full flex flex-row justify-between h-16'>
                  <input
                    className=' flex-1 px-2  outline-none'
                    placeholder='Escribe aqui tu mensaje'
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChat(message);
                        setMessage('');
                      }
                    }}
                    value={message} />
                  <Button
                    isIconOnly
                    variant="light"
                    size="md"
                    onPress={() => {
                      addChat(message)
                      setMessage('')
                    }}
                    className="w-10 flex justify-center items-center rounded-xl  text-white m-2 hover:opacity-40"
                    style={{ backgroundColor: widget.colorHeader }}
                  >
                    <SentIcon />
                  </Button>
                </div>
              </>}

          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
