// src/events/consumers/emailConsumer.ts
import { KafkaService, eventTopics } from '../../utils/kafka';
import { EmailService } from '../../modules/auth/services/EmailService';

export async function startEmailConsumer() {
  const consumer = await KafkaService.createConsumer('email-service', [
    eventTopics.USER_CREATED,
    eventTopics.USER_VERIFIED
  ]);

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value!.toString());

      switch (topic) {
        case eventTopics.USER_CREATED:
          await EmailService.sendWelcomeEmail(data.email);
          break;
        case eventTopics.USER_VERIFIED:
          await EmailService.sendVerificationConfirmation(data.email);
          break;
      }
    }
  });
}