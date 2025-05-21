import { TranslateModelUseTypeVO } from './Vo';

export interface TranslateModelProps {
   id?: string;
   defaultParam?: any;
   prompt: string;
   useType: TranslateModelUseTypeVO;
   isActive?: boolean;
   createdAt?: Date;
}

export class TranslateModel {
   public readonly id: string;
   public readonly defaultParam: any;
   public readonly prompt: string;
   public readonly useType: TranslateModelUseTypeVO;
   public readonly isActive: boolean;
   public readonly createdAt: Date;

   protected constructor(props: TranslateModelProps) {
      this.id = props.id ?? crypto.randomUUID();
      this.defaultParam = props.defaultParam ?? {};
      this.prompt = props.prompt;
      this.useType = props.useType;
      this.isActive = props.isActive ?? true;
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

   deactivate(): TranslateModel {
      return new TranslateModel({
         ...this,
         isActive: false,
         createdAt: this.createdAt,
      });
   }
}
