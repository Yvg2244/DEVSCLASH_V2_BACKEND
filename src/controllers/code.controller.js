import Docker from "dockerode";
import { api_error } from "../utils/api_error.js";
import { api_response } from "../utils/api_response.js";
import async_handler from "../utils/async_handler.js";

const execute_code = async_handler(async (req, res) => {
  const docker = new Docker();
  const user_code = req.body.code;
  if (!user_code) {
    throw new api_error(400, "Code feild is required");
  }
  const container = await docker.createContainer({
    Image: "python",
    Tty: true,
    Cmd: ["/bin/sh", "-c", user_code],
    AttachStdout: true,
    AttachStderr: true,
  });
  try {
    await container.start();
    
    const output = await getStreamData(container);
    
    const { status_code } = await container.wait();
    if (status_code === 0) {
      throw new api_response(200, output, "Code executed successfully");
    } else {
      throw new api_error(500, output);
    }
  } finally {
    await container.remove();
  }
});
async function getStreamData(container) {
  return new Promise((resolve, reject) => {
    container.attach({ stream: true, stdout: true, stderr: true }, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }

      let data = '';

      stream.on('data', (chunk) => {
        data += chunk.toString();
      });

      stream.on('end', () => {
        resolve(data);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  });
}

export { execute_code };
