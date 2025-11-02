import React, { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

const DangerZone = ({ user, onAccountDeleted }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="settings-section danger-zone">
      <h2>⚠️ Danger Zone</h2>
      <div className="danger-zone-content">
        <div className="danger-zone-info">
          <h3>Delete Account</h3>
          <p>
            Permanently delete your Finance Tracker account and all associated
            data. This action cannot be undone.
          </p>
        </div>
        <button className="danger-btn" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          userEmail={user.email}
          onClose={() => setShowDeleteModal(false)}
          onAccountDeleted={onAccountDeleted}
        />
      )}
    </div>
  );
};

export default DangerZone;
