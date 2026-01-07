/**
 * Firestore service for managing AI Chatbot chat history
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const CHAT_HISTORY_COLLECTION = 'ai_chat_history';

/**
 * Save a message to Firestore chat history
 * @param {string} userId - User ID
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Message content
 * @param {string} sessionId - Optional session ID for grouping conversations
 * @returns {Promise<Object>} - Saved message document
 */
export async function saveChatMessage(userId, role, content, sessionId = null) {
  try {
    const messageId = `${userId}_${Date.now()}_${Math.random()}`;
    const messageRef = doc(db, CHAT_HISTORY_COLLECTION, messageId);

    await setDoc(messageRef, {
      userId,
      role,
      content,
      sessionId: sessionId || 'default',
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    return {
      id: messageId,
      role,
      content,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
}

/**
 * Get chat history for a user
 * @param {string} userId - User ID
 * @param {string} sessionId - Optional session ID to filter by
 * @param {number} limit - Number of messages to retrieve (default: 50)
 * @returns {Promise<Array>} - Array of messages
 */
export async function getChatHistory(userId, sessionId = 'default', limit = 50) {
  try {
    const q = query(
      collection(db, CHAT_HISTORY_COLLECTION),
      where('userId', '==', userId),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      });
    });

    // Return only the latest messages up to the limit
    return messages.slice(-limit);
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    throw error;
  }
}

/**
 * Get all chat sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of unique session IDs with metadata
 */
export async function getChatSessions(userId) {
  try {
    const q = query(
      collection(db, CHAT_HISTORY_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sessions = new Map();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!sessions.has(data.sessionId)) {
        sessions.set(data.sessionId, {
          sessionId: data.sessionId,
          lastMessage: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
          messageCount: 0
        });
      }
      const session = sessions.get(data.sessionId);
      session.messageCount++;
      if (!session.lastMessageTime || data.timestamp > session.lastMessageTime) {
        session.lastMessage = data.content;
        session.lastMessageTime = data.timestamp;
      }
    });

    return Array.from(sessions.values());
  } catch (error) {
    console.error('Error retrieving chat sessions:', error);
    throw error;
  }
}

/**
 * Clear chat history for a user (entire history or specific session)
 * @param {string} userId - User ID
 * @param {string} sessionId - Optional session ID to delete only that session
 * @returns {Promise<void>}
 */
export async function clearChatHistory(userId, sessionId = null) {
  try {
    let q;
    if (sessionId) {
      q = query(
        collection(db, CHAT_HISTORY_COLLECTION),
        where('userId', '==', userId),
        where('sessionId', '==', sessionId)
      );
    } else {
      q = query(
        collection(db, CHAT_HISTORY_COLLECTION),
        where('userId', '==', userId)
      );
    }

    const querySnapshot = await getDocs(q);
    const deletePromises = [];

    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
}

/**
 * Delete a specific message
 * @param {string} messageId - Message ID
 * @returns {Promise<void>}
 */
export async function deleteMessage(messageId) {
  try {
    await deleteDoc(doc(db, CHAT_HISTORY_COLLECTION, messageId));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

/**
 * Update user preferences for AI Chatbot (interests, location, etc.)
 * @param {string} userId - User ID
 * @param {Object} preferences - Preferences object
 * @returns {Promise<void>}
 */
export async function updateChatbotPreferences(userId, preferences) {
  try {
    const prefsRef = doc(db, 'users', userId);
    await updateDoc(prefsRef, {
      chatbotPreferences: preferences,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating chatbot preferences:', error);
    throw error;
  }
}

/**
 * Get user preferences for AI Chatbot
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User preferences
 */
export async function getChatbotPreferences(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().chatbotPreferences || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting chatbot preferences:', error);
    return {};
  }
}
