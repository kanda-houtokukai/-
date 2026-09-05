/**
 * Remotion CLI 設定。Node.js API から使う場合はここは効かない（オプションを直接渡す）。
 * https://remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
