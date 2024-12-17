import dayjs from "dayjs";
import logger, {pino} from "pino";

const transport = pino.transport({
    target: "pino-pretty",
    options: {colorize: true},
});

const loggerOptions = {
    base: 
    {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
};

const log = logger(loggerOptions, transport);
export default log;
