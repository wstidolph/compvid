import 'jest-preset-angular/setup-jest'
import { TextEncoder, TextDecoder } from 'util';

  // text-encoding no longersupported
  //import{TextDecoder} from 'text-encoding'

global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;



