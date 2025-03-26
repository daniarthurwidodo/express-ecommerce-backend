// src/utils/kafka.ts
import { Kafka, Producer, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ecommerce-app',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

export const eventTopics = {
  USER_CREATED: 'user.created',
  USER_VERIFIED: 'user.verified',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  STOCK_UPDATED: 'product.stock.updated'
};

export class KafkaService {
  private producer: Producer;
  
  constructor() {
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async emit(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ 
        value: JSON.stringify(message)
      }]
    });
  }

  static async createConsumer(groupId: string, topics: string[]): Promise<Consumer> {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await Promise.all(topics.map(topic => consumer.subscribe({ topic })));
    return consumer;
  }
}