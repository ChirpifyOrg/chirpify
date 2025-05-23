import { AIModelTypeVO } from '../Vo';
import { TranslateModelUseTypeVO } from './Vo';

export interface TranslateModelProps {
   id?: string;
   defaultParam?: any;
   prompt: string;
   useType: TranslateModelUseTypeVO;
   isActive?: boolean;
   aiModelType: AIModelTypeVO;
   createdAt?: Date;
}

export class TranslateModel {
   public readonly id: string;
   public readonly defaultParam: any;
   public readonly prompt: string;
   public readonly useType: TranslateModelUseTypeVO;
   public readonly isActive: boolean;
   public readonly aiModelType: AIModelTypeVO;
   public readonly createdAt: Date;

   protected constructor(props: TranslateModelProps) {
      this.id = props.id ?? crypto.randomUUID();
      this.defaultParam = props.defaultParam ?? {};
      this.prompt = props.prompt;
      this.useType = props.useType;
      this.isActive = props.isActive ?? true;
      this.aiModelType = props.aiModelType;
      this.createdAt = props.createdAt ?? new Date();
   }
   static create(props: Omit<TranslateModelProps, 'id' | 'createdAt' | 'isActive'>): TranslateModel {
      return new TranslateModel({
         ...props,
         id: crypto.randomUUID(),
         isActive: true,
         createdAt: new Date(),
      });
   }
   static fromPrisma(prismaObj: any): TranslateModel {
      return new TranslateModel({
         id: typeof prismaObj.id === 'string' ? prismaObj.id : String(prismaObj.id),
         defaultParam: (() => {
            if (!prismaObj.default_param) return {};
            try {
               return typeof prismaObj.default_param === 'string'
                  ? JSON.parse(prismaObj.default_param)
                  : prismaObj.default_param;
            } catch {
               return {};
            }
         })(),
         prompt: prismaObj.prompt ?? '',
         useType: TranslateModelUseTypeVO.create(prismaObj.use_type ?? 'unknown'),
         isActive: prismaObj.is_active ?? true,
         aiModelType: AIModelTypeVO.create(prismaObj.ai_model_type ?? 'GPT'),
         createdAt: prismaObj.created_at instanceof Date ? prismaObj.created_at : new Date(prismaObj.created_at),
      });
   }
   deactivate(): TranslateModel {
      return new TranslateModel({
         ...this,
         isActive: false,
         createdAt: this.createdAt,
      });
   }
}
