<?php

namespace App\Services;

use Kreait\Firebase\Contract\Database;

class FirebaseService
{
    protected Database $db;

    public function __construct(Database $database)
    {
        $this->db = $database;
    }

    /**
     * Get all updates ordered by date descending
     */
    public function getUpdates(): array
    {
        $reference = $this->db->getReference('updates');
        $snapshot = $reference->getSnapshot();
        $values = $snapshot->getValue();

        if (!$values) {
            return [];
        }

        $updates = [];
        foreach ($values as $id => $data) {
            $updates[] = array_merge(['id' => $id], $data);
        }

        // Sort by date DESC
        usort($updates, function ($a, $b) {
            return strtotime($b['date']) <=> strtotime($a['date']);
        });

        return $updates;
    }

    /**
     * Get a single update by ID
     */
    public function getUpdate(string $id): ?array
    {
        $reference = $this->db->getReference('updates/' . $id);
        $snapshot = $reference->getSnapshot();
        $data = $snapshot->getValue();

        if (!$data) {
            return null;
        }

        return array_merge(['id' => $id], $data);
    }

    /**
     * Create a new update
     */
    public function createUpdate(array $data): string
    {
        $data['created_at'] = date('c');
        $data['updated_at'] = date('c');

        $reference = $this->db->getReference('updates')->push($data);
        return $reference->getKey();
    }

    /**
     * Update an existing update
     */
    public function updateUpdate(string $id, array $data): void
    {
        $data['updated_at'] = date('c');
        $this->db->getReference('updates/' . $id)->update($data);
    }

    /**
     * Delete an update
     */
    public function deleteUpdate(string $id): void
    {
        $this->db->getReference('updates/' . $id)->remove();
    }
}
