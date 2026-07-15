<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FirebaseService;
use Illuminate\Http\Request;

class UpdateController extends Controller
{
    protected FirebaseService $firebase;

    public function __construct()
    {
        // Only bind Firebase service if credentials are available
        $credentialsPath = base_path(env('FIREBASE_CREDENTIALS', 'firebase/serviceAccountKey.json'));
        if (file_exists($credentialsPath)) {
            $this->firebase = app(FirebaseService::class);
        }
    }

    protected function hasFirebase(): bool
    {
        return isset($this->firebase);
    }

    public function index()
    {
        if (!$this->hasFirebase()) {
            return view('admin.updates.index', ['updates' => []])->with('error', 'Firebase belum dikonfigurasi. Silakan upload serviceAccountKey.json ke folder firebase/.');
        }
        $updates = $this->firebase->getUpdates();
        return view('admin.updates.index', compact('updates'));
    }

    public function create()
    {
        return view('admin.updates.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'version'     => 'required|string|max:50',
            'date'        => 'required|date',
            'description' => 'required|string',
        ]);

        $this->firebase->createUpdate([
            'title'       => $request->title,
            'version'     => $request->version,
            'date'        => $request->date,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.updates.index')
            ->with('success', 'Update berhasil ditambahkan!');
    }

    public function edit(string $id)
    {
        $update = $this->firebase->getUpdate($id);
        if (!$update) {
            abort(404, 'Update tidak ditemukan.');
        }
        return view('admin.updates.edit', compact('update'));
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'version'     => 'required|string|max:50',
            'date'        => 'required|date',
            'description' => 'required|string',
        ]);

        $this->firebase->updateUpdate($id, [
            'title'       => $request->title,
            'version'     => $request->version,
            'date'        => $request->date,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.updates.index')
            ->with('success', 'Update berhasil diperbarui!');
    }

    public function destroy(string $id)
    {
        $this->firebase->deleteUpdate($id);
        return redirect()->route('admin.updates.index')
            ->with('success', 'Update berhasil dihapus.');
    }
}
