import { IEnvironment } from '@compvid/xplat/core';
import { deepMerge } from '@compvid/xplat/utils';
import { environmentBase } from './environment.base';

export const environmentProd = deepMerge(environmentBase, <IEnvironment>{
  production: true,
  // customizations here...
});
